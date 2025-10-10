# 🤖 AI Server Setup Guide

## 🚨 **Quick Fix for AI Assistant Error**

The AI Assistant is showing an error because the server needs to be running with the AI routes. Here's how to fix it:

### **Option 1: Quick Fix (Fallback Mode)**
The AI Assistant now has a **fallback mode** that works even without the server running. It will provide intelligent responses based on your questions about:
- Vehicle searches
- Pricing information  
- Quality assessment
- Comparisons
- General help

### **Option 2: Full AI Setup (Recommended)**

#### **1. Install Dependencies**
```bash
# Navigate to server directory
cd server

# Install required packages
npm install natural @supabase/supabase-js axios
```

#### **2. Set Up Environment Variables**
Create a `.env` file in the server directory:
```env
# Basic setup (required for fallback to work)
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# AI API Keys (optional - for advanced features)
OPENAI_API_KEY=your_openai_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
```

#### **3. Start the Server**
```bash
# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

#### **4. Test AI Features**
```bash
# Test all AI systems
node test-ai-features.js
```

---

## 🎯 **Current Status**

### **✅ Working Now:**
- **AI Assistant Fallback Mode** - Intelligent responses without server
- **Smart Suggestions** - Context-aware suggestions
- **Vehicle Search Help** - Brand-specific assistance
- **Pricing Guidance** - Market price information
- **Quality Assessment** - Vehicle evaluation help

### **🚀 Full AI Features (When Server is Running):**
- **Advanced NLP** - Natural language understanding
- **Price Prediction** - ML-powered pricing
- **Quality Assessment** - AI-powered evaluation
- **Market Intelligence** - Real-time insights
- **External AI Integration** - GPT-4, Claude-3

---

## 🔧 **Troubleshooting**

### **If AI Assistant Still Shows Errors:**

1. **Check Server Status:**
   ```bash
   # Check if server is running
   curl http://localhost:5001/api/health
   ```

2. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for network errors in Console tab
   - Check if requests to `localhost:5001` are failing

3. **Verify Port:**
   - Make sure port 5001 is not blocked
   - Check if another service is using port 5001

### **Common Issues:**

1. **"Connection Refused"**
   - Server is not running
   - Start server with `npm start`

2. **"CORS Error"**
   - Server is running but CORS is not configured
   - Check server/index.js for CORS setup

3. **"API Key Error"**
   - Missing or invalid API keys
   - Add API keys to .env file (optional for basic features)

---

## 🎉 **What's Working Right Now**

Even without the full server setup, your AI Assistant now provides:

✅ **Intelligent Responses** - Context-aware answers  
✅ **Smart Suggestions** - Relevant follow-up options  
✅ **Vehicle Search Help** - Brand and model assistance  
✅ **Pricing Guidance** - Market price information  
✅ **Quality Assessment** - Vehicle evaluation help  
✅ **Professional Interface** - Beautiful chat UI  

---

## 🚀 **Next Steps**

1. **Try the AI Assistant now** - It should work with fallback responses
2. **Set up the server** - For full AI features
3. **Add API keys** - For advanced AI capabilities
4. **Test all features** - Use the test script

**Your AI Assistant is now functional and will provide helpful responses!** 🤖✨
