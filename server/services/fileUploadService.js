const multer = require('multer');
const sharp = require('sharp');
const fileType = require('file-type');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { encryptFile, generateSecureString } = require('../middleware/databaseEncryption');

class FileUploadService {
  constructor() {
    this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    this.allowedDocumentTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.maxImageSize = 5 * 1024 * 1024; // 5MB
    this.uploadDir = path.join(__dirname, '../uploads');
    this.secureDir = path.join(__dirname, '../secure-uploads');
    
    this.ensureDirectories();
  }

  /**
   * Ensure upload directories exist
   */
  ensureDirectories() {
    [this.uploadDir, this.secureDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Generate secure filename
   * @param {string} originalName - Original filename
   * @returns {string} Secure filename
   */
  generateSecureFilename(originalName) {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomString = generateSecureString(16);
    return `${timestamp}_${randomString}${ext}`;
  }

  /**
   * Validate file type by reading file header
   * @param {Buffer} buffer - File buffer
   * @param {string} mimeType - Declared MIME type
   * @returns {boolean} Whether file type is valid
   */
  async validateFileType(buffer, mimeType) {
    try {
      const fileTypeInfo = await fileType.fromBuffer(buffer);
      
      if (!fileTypeInfo) {
        return false;
      }

      // Check if declared MIME type matches actual file type
      const actualMimeType = fileTypeInfo.mime;
      const allowedTypes = [...this.allowedImageTypes, ...this.allowedDocumentTypes];
      
      return allowedTypes.includes(actualMimeType) && 
             allowedTypes.includes(mimeType) &&
             actualMimeType === mimeType;
    } catch (error) {
      console.error('File type validation error:', error);
      return false;
    }
  }

  /**
   * Scan file for malicious content
   * @param {Buffer} buffer - File buffer
   * @returns {Object} Scan result
   */
  async scanFile(buffer) {
    const scanResult = {
      isSafe: true,
      threats: [],
      warnings: []
    };

    try {
      // Check for executable signatures
      const executableSignatures = [
        Buffer.from([0x4D, 0x5A]), // PE executable
        Buffer.from([0x7F, 0x45, 0x4C, 0x46]), // ELF executable
        Buffer.from([0xFE, 0xED, 0xFA, 0xCE]), // Mach-O executable
        Buffer.from([0xCE, 0xFA, 0xED, 0xFE])  // Mach-O executable (reverse)
      ];

      for (const signature of executableSignatures) {
        if (buffer.indexOf(signature) !== -1) {
          scanResult.isSafe = false;
          scanResult.threats.push('Executable file detected');
        }
      }

      // Check for script signatures
      const scriptSignatures = [
        Buffer.from('<script', 'utf8'),
        Buffer.from('javascript:', 'utf8'),
        Buffer.from('vbscript:', 'utf8'),
        Buffer.from('onload=', 'utf8'),
        Buffer.from('onerror=', 'utf8')
      ];

      for (const signature of scriptSignatures) {
        if (buffer.indexOf(signature) !== -1) {
          scanResult.warnings.push('Script content detected');
        }
      }

      // Check file size
      if (buffer.length > this.maxFileSize) {
        scanResult.isSafe = false;
        scanResult.threats.push('File size exceeds limit');
      }

      // Check for null bytes (potential security risk)
      if (buffer.indexOf(0x00) !== -1) {
        scanResult.warnings.push('Null bytes detected');
      }

    } catch (error) {
      console.error('File scan error:', error);
      scanResult.isSafe = false;
      scanResult.threats.push('Scan error occurred');
    }

    return scanResult;
  }

  /**
   * Process and optimize image
   * @param {Buffer} buffer - Image buffer
   * @param {Object} options - Processing options
   * @returns {Buffer} Processed image buffer
   */
  async processImage(buffer, options = {}) {
    try {
      const {
        width = 1920,
        height = 1080,
        quality = 85,
        format = 'jpeg'
      } = options;

      let processor = sharp(buffer);

      // Resize if needed
      processor = processor.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Apply format-specific processing
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          processor = processor.jpeg({ quality });
          break;
        case 'png':
          processor = processor.png({ quality });
          break;
        case 'webp':
          processor = processor.webp({ quality });
          break;
        default:
          processor = processor.jpeg({ quality });
      }

      return await processor.toBuffer();
    } catch (error) {
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Create multer configuration
   * @param {Object} options - Upload options
   * @returns {Object} Multer configuration
   */
  createMulterConfig(options = {}) {
    const {
      allowedTypes = this.allowedImageTypes,
      maxSize = this.maxImageSize,
      destination = this.uploadDir
    } = options;

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const secureFilename = this.generateSecureFilename(file.originalname);
        cb(null, secureFilename);
      }
    });

    const fileFilter = (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: maxSize,
        files: 5 // Maximum 5 files per request
      }
    });
  }

  /**
   * Secure file upload handler
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  async handleSecureUpload(req, res, next) {
    try {
      if (!req.file && !req.files) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const files = req.files || [req.file];
      const processedFiles = [];

      for (const file of files) {
        // Read file buffer
        const buffer = fs.readFileSync(file.path);
        
        // Validate file type
        const isValidType = await this.validateFileType(buffer, file.mimetype);
        if (!isValidType) {
          // Clean up uploaded file
          fs.unlinkSync(file.path);
          return res.status(400).json({ 
            error: 'Invalid file type or file type mismatch' 
          });
        }

        // Scan file for threats
        const scanResult = await this.scanFile(buffer);
        if (!scanResult.isSafe) {
          // Clean up uploaded file
          fs.unlinkSync(file.path);
          return res.status(400).json({ 
            error: 'File rejected for security reasons',
            threats: scanResult.threats
          });
        }

        // Process image if it's an image file
        let processedBuffer = buffer;
        if (this.allowedImageTypes.includes(file.mimetype)) {
          try {
            processedBuffer = await this.processImage(buffer);
          } catch (error) {
            console.warn('Image processing failed, using original:', error.message);
          }
        }

        // Generate secure filename
        const secureFilename = this.generateSecureFilename(file.originalname);
        const securePath = path.join(this.secureDir, secureFilename);

        // Write processed file to secure location
        fs.writeFileSync(securePath, processedBuffer);

        // Encrypt file for additional security
        const encryptedFile = encryptFile(processedBuffer);
        const encryptedPath = path.join(this.secureDir, `${secureFilename}.enc`);
        fs.writeFileSync(encryptedPath, JSON.stringify(encryptedFile));

        // Clean up original uploaded file
        fs.unlinkSync(file.path);

        // Store file information
        const fileInfo = {
          originalName: file.originalname,
          secureName: secureFilename,
          mimeType: file.mimetype,
          size: processedBuffer.length,
          uploadDate: new Date().toISOString(),
          scanResult,
          encrypted: true,
          path: securePath,
          encryptedPath
        };

        processedFiles.push(fileInfo);

        // Log upload event
        this.logUploadEvent('FILE_UPLOADED', fileInfo, req);
      }

      req.uploadedFiles = processedFiles;
      next();

    } catch (error) {
      console.error('Secure upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  }

  /**
   * Get file information
   * @param {string} filename - Secure filename
   * @returns {Object} File information
   */
  getFileInfo(filename) {
    const filePath = path.join(this.secureDir, filename);
    const encryptedPath = path.join(this.secureDir, `${filename}.enc`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);
    return {
      filename,
      path: filePath,
      encryptedPath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  }

  /**
   * Delete file securely
   * @param {string} filename - Secure filename
   * @returns {boolean} Whether deletion was successful
   */
  deleteFile(filename) {
    try {
      const filePath = path.join(this.secureDir, filename);
      const encryptedPath = path.join(this.secureDir, `${filename}.enc`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      if (fs.existsSync(encryptedPath)) {
        fs.unlinkSync(encryptedPath);
      }

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  /**
   * Log upload events for audit
   * @param {string} eventType - Event type
   * @param {Object} fileInfo - File information
   * @param {Object} req - Request object
   */
  logUploadEvent(eventType, fileInfo, req) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      filename: fileInfo.secureName,
      originalName: fileInfo.originalName,
      mimeType: fileInfo.mimeType,
      size: fileInfo.size,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log(`📁 File Upload Event: ${eventType}`, event);
    }

    // In production, this would be sent to a logging service
    return event;
  }

  /**
   * Create upload middleware for specific file types
   * @param {Object} options - Upload options
   * @returns {Function} Express middleware
   */
  createUploadMiddleware(options = {}) {
    const multerConfig = this.createMulterConfig(options);
    const upload = multerConfig.single('file');

    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        this.handleSecureUpload(req, res, next);
      });
    };
  }

  /**
   * Create multiple file upload middleware
   * @param {Object} options - Upload options
   * @returns {Function} Express middleware
   */
  createMultipleUploadMiddleware(options = {}) {
    const multerConfig = this.createMulterConfig(options);
    const upload = multerConfig.array('files', 5);

    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        this.handleSecureUpload(req, res, next);
      });
    };
  }
}

module.exports = new FileUploadService();
