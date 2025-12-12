# 🚀 cPanel Deployment Guide for Skyfalke Backend

## 📋 Prerequisites

- ✅ cPanel hosting with Node.js support
- ✅ SSH access (recommended)
- ✅ Git repository access
- ✅ MongoDB Atlas account (for database)

## 🔧 Step 1: Prepare Your Backend

### 1.1 Update package.json (Already Done)
- ✅ Production start script added
- ✅ Node.js version requirements specified
- ✅ Build scripts configured

### 1.2 Create Production Environment File
Create `.env` file in your server directory with:

```env
# Production Environment Variables
NODE_ENV=production
PORT=5000

# MongoDB Connection (Use your production MongoDB)
MONGODB_URI=mongodb+srv://skyfalkegroup:87654321Skyfalke$$.@skyfalkegroup-cluster.kiwaycv.mongodb.net/Skyfalkegroup

# JWT Configuration
JWT_SECRET=hj899kjjjjjghfwqwweoewxosdkdoghdfdgknopmij8967rvd
JWT_EXPIRE=7d

# Email configuration
EMAIL_HOST=smtp.skyfalke.com
EMAIL_PORT=465
EMAIL_USER=noreply@skyfalke.com
EMAIL_PASS=37016568Matekwa@@.

# Admin credentials
ADMIN_EMAIL=mronald@skyfalke.com
ADMIN_PASSWORD=admin123

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_u6yPpR7WdsopVg9Tbueiha1ydHw=
IMAGEKIT_PRIVATE_KEY=private_k9vORRBoensuszXaRw3DWpsFiGs=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/g3nahgeeu/

# CORS Configuration (Your domain)
CORS_ORIGIN=https://skyfalke.com,https://www.skyfalke.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Trust Proxy (for cPanel)
TRUST_PROXY=true
```

## 🌐 Step 2: cPanel Deployment

### 2.1 Access cPanel
1. **Login to cPanel** with your hosting credentials
2. **Navigate to "Software"** section
3. **Click "Node.js"** or "Node.js Selector"

### 2.2 Create Node.js App
1. **Click "Create Application"**
2. **Fill in the details:**
   - **Node.js version**: 18.x or 20.x (LTS)
   - **Application mode**: Production
   - **Application root**: `/home/username/nodeapps/skyfalke-backend`
   - **Application URL**: `https://yourdomain.com:5000` or subdomain
   - **Application startup file**: `index.js`
   - **Passenger port**: `5000`

### 2.3 Upload Your Code
1. **Use File Manager** or **Git** to upload your server code
2. **Extract** if uploading ZIP file
3. **Ensure structure** matches your local setup

### 2.4 Install Dependencies
1. **Open Terminal** in cPanel (or use SSH)
2. **Navigate to your app directory**:
   ```bash
   cd /home/username/nodeapps/skyfalke-backend
   ```
3. **Install dependencies**:
   ```bash
   npm install --production
   ```

## 🔐 Step 3: Environment Setup

### 3.1 Set Environment Variables
1. **In cPanel Node.js app settings**
2. **Add environment variables** from your `.env` file
3. **Or create `.env` file** in your app directory

### 3.2 Database Connection
1. **Ensure MongoDB Atlas** is accessible from your server
2. **Check IP whitelist** in MongoDB Atlas
3. **Test connection** with your app

## 🚀 Step 4: Start Your Application

### 4.1 Start the App
1. **In cPanel Node.js settings**
2. **Click "Restart"** or "Start"
3. **Check logs** for any errors

### 4.2 Test Your Endpoints
1. **Health check**: `https://yourdomain.com:5000/api/health`
2. **Blog endpoint**: `https://yourdomain.com:5000/api/blogs`
3. **ImageKit test**: `https://yourdomain.com:5000/api/blogs/test-imagekit`

## 🌍 Step 5: Update Frontend

### 5.1 Update API URL
In your React app, set:
```env
REACT_APP_API_URL=https://yourdomain.com:5000
```

### 5.2 Rebuild and Deploy Frontend
1. **Build your React app**: `npm run build`
2. **Upload to cPanel** public_html directory
3. **Test blog functionality**

## 🔍 Step 6: Troubleshooting

### Common Issues:

#### 1. Port Already in Use
- **Solution**: Change port in `.env` and cPanel settings
- **Alternative**: Use subdomain instead of port

#### 2. MongoDB Connection Failed
- **Check**: IP whitelist in MongoDB Atlas
- **Verify**: Connection string format
- **Test**: Connection from server

#### 3. ImageKit Upload Fails
- **Verify**: API keys are correct
- **Check**: Environment variables are set
- **Test**: ImageKit connectivity endpoint

#### 4. CORS Errors
- **Update**: CORS_ORIGIN in environment
- **Check**: Frontend domain matches
- **Verify**: HTTPS vs HTTP

## 📊 Step 7: Monitoring

### 7.1 Check Logs
- **cPanel logs**: Application logs
- **Node.js logs**: Console output
- **Error logs**: Any failed requests

### 7.2 Health Monitoring
- **Regular health checks**: `/api/health`
- **Database connectivity**: MongoDB status
- **ImageKit status**: Upload functionality

## ✅ Success Checklist

- [ ] Node.js app created in cPanel
- [ ] Code uploaded and extracted
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] App started successfully
- [ ] Health endpoint responding
- [ ] Blog endpoints working
- [ ] Image uploads working
- [ ] Frontend updated with new API URL
- [ ] Blog system fully functional

## 🆘 Need Help?

If you encounter issues:
1. **Check cPanel logs** for errors
2. **Verify environment variables** are set
3. **Test endpoints** individually
4. **Check MongoDB** connectivity
5. **Verify ImageKit** configuration

## 🎯 Expected Result

After successful deployment:
- ✅ **Blog creation** works on live site
- ✅ **Image uploads** work with ImageKit
- ✅ **Blog management** fully functional
- ✅ **API endpoints** responding correctly
- ✅ **Database** storing blog data

---

**Good luck with your deployment! 🚀**
