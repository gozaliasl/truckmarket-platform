const express = require('express');
const router = express.Router();
const fileUploadService = require('../services/fileUploadService');
const { authMiddleware } = require('../auth');
const { validateFileUpload } = require('../middleware/validation');
const path = require('path');
const fs = require('fs');

/**
 * POST /api/upload/image
 * Upload and process image files
 */
router.post('/image', authMiddleware, fileUploadService.createUploadMiddleware({
  allowedTypes: fileUploadService.allowedImageTypes,
  maxSize: fileUploadService.maxImageSize
}), (req, res) => {
  try {
    const uploadedFiles = req.uploadedFiles;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      files: uploadedFiles.map(file => ({
        id: file.secureName,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        uploadDate: file.uploadDate,
        url: `/api/files/${file.secureName}`
      }))
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

/**
 * POST /api/upload/document
 * Upload document files
 */
router.post('/document', authMiddleware, fileUploadService.createUploadMiddleware({
  allowedTypes: fileUploadService.allowedDocumentTypes,
  maxSize: fileUploadService.maxFileSize
}), (req, res) => {
  try {
    const uploadedFiles = req.uploadedFiles;
    
    res.json({
      success: true,
      message: 'Document uploaded successfully',
      files: uploadedFiles.map(file => ({
        id: file.secureName,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        uploadDate: file.uploadDate,
        url: `/api/files/${file.secureName}`
      }))
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Document upload failed' });
  }
});

/**
 * POST /api/upload/multiple
 * Upload multiple files
 */
router.post('/multiple', authMiddleware, fileUploadService.createMultipleUploadMiddleware(), (req, res) => {
  try {
    const uploadedFiles = req.uploadedFiles;
    
    res.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles.map(file => ({
        id: file.secureName,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        uploadDate: file.uploadDate,
        url: `/api/files/${file.secureName}`
      }))
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Multiple file upload failed' });
  }
});

/**
 * GET /api/files/:filename
 * Serve uploaded files
 */
router.get('/:filename', authMiddleware, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const fileInfo = fileUploadService.getFileInfo(filename);
    
    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    // Stream file to response
    const fileStream = fs.createReadStream(fileInfo.path);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      res.status(500).json({ error: 'File streaming failed' });
    });

  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({ error: 'File serve failed' });
  }
});

/**
 * GET /api/files/:filename/info
 * Get file information
 */
router.get('/:filename/info', authMiddleware, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const fileInfo = fileUploadService.getFileInfo(filename);
    
    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      success: true,
      file: {
        filename: fileInfo.filename,
        size: fileInfo.size,
        created: fileInfo.created,
        modified: fileInfo.modified,
        url: `/api/files/${fileInfo.filename}`
      }
    });

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ error: 'Failed to get file information' });
  }
});

/**
 * DELETE /api/files/:filename
 * Delete uploaded file
 */
router.delete('/:filename', authMiddleware, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const success = fileUploadService.deleteFile(filename);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'File deletion failed' });
  }
});

/**
 * GET /api/upload/limits
 * Get upload limits and allowed types
 */
router.get('/limits', authMiddleware, (req, res) => {
  res.json({
    success: true,
    limits: {
      maxFileSize: fileUploadService.maxFileSize,
      maxImageSize: fileUploadService.maxImageSize,
      maxFiles: 5,
      allowedImageTypes: fileUploadService.allowedImageTypes,
      allowedDocumentTypes: fileUploadService.allowedDocumentTypes
    }
  });
});

/**
 * POST /api/upload/scan
 * Scan file for threats without uploading
 */
router.post('/scan', authMiddleware, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided for scanning' });
    }

    const buffer = fs.readFileSync(req.file.path);
    
    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    // Scan file
    fileUploadService.scanFile(buffer).then(scanResult => {
      res.json({
        success: true,
        scanResult,
        message: scanResult.isSafe ? 'File is safe' : 'File contains potential threats'
      });
    }).catch(error => {
      console.error('File scan error:', error);
      res.status(500).json({ error: 'File scan failed' });
    });

  } catch (error) {
    console.error('File scan endpoint error:', error);
    res.status(500).json({ error: 'File scan endpoint failed' });
  }
});

module.exports = router;
