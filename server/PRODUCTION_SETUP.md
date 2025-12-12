# Production Backend Setup Guide

## 🔧 **Environment Configuration**

Create a `.env` file in the `server` directory with the following production settings:

```env
# Production Environment Configuration
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://skyfalkegroup:87654321Skyfalke$$.@skyfalkegroup-cluster.kiwaycv.mongodb.net/Skyfalkegroup

# JWT Configuration
JWT_SECRET=hj899kjjjjjghfwqwweoewxosdkdoghdfdgknopmij8967rvd
JWT_EXPIRE=7d

# Email configuration (for contact forms)
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

# CORS Configuration
CORS_ORIGIN=https://skyfalke.com,https://www.skyfalke.com,http://localhost:3000

# Rate Limiting (stricter for production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Security
TRUST_PROXY=1
SECURE_COOKIES=true

# Logging
LOG_LEVEL=error
```

## 🚀 **Production Deployment Steps**

### 1. **Install Dependencies**
```bash
npm install --production
```

### 2. **Set Environment Variables**
- Copy the above environment configuration to `.env`
- Ensure all sensitive data is properly secured

### 3. **Start Production Server**
```bash
npm start
```

### 4. **Health Check**
Test the API health endpoint:
```bash
curl https://apis.mwangikinyanjuiadvocates.com/api/health
```

## 🔒 **Security Enhancements**

### 1. **Update CORS Configuration**
The server already includes CORS, but ensure it's configured for your domain.

### 2. **Rate Limiting**
Production uses stricter rate limiting (50 requests per 15 minutes).

### 3. **Helmet Security**
Already configured with helmet for security headers.

### 4. **Compression**
Already enabled for better performance.

## 📊 **Monitoring & Logging**

### 1. **Health Check Endpoint**
- URL: `/api/health`
- Returns: `{ status: 'OK', timestamp: '...' }`

### 2. **WebSocket Test**
- URL: `/api/ws-test`
- Returns WebSocket server status

### 3. **Logging**
- Production uses 'error' level logging
- Morgan combined logging enabled

## 🔧 **Performance Optimizations**

### 1. **Database Indexes**
Ensure MongoDB indexes are created for optimal performance.

### 2. **Caching**
Consider implementing Redis for session storage and caching.

### 3. **CDN**
Use ImageKit CDN for static assets (already configured).

## 🚨 **Important Notes**

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** in production
3. **Enable HTTPS** on your server
4. **Set up proper monitoring** and alerting
5. **Regular backups** of your MongoDB database
6. **Keep dependencies updated** regularly

## 🔍 **Testing Production**

### 1. **API Health Check**
```bash
curl -X GET https://apis.mwangikinyanjuiadvocates.com/api/health
```

### 2. **Test Authentication**
```bash
curl -X POST https://apis.mwangikinyanjuiadvocates.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 3. **Test WebSocket**
```bash
curl -X GET https://apis.mwangikinyanjuiadvocates.com/api/ws-test
```

## 📝 **Deployment Checklist**

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Database connected
- [ ] Health check passing
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Logging configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
