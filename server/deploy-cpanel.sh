#!/bin/bash

# 🚀 Skyfalke Backend cPanel Deployment Script
# This script helps prepare your backend for cPanel deployment

echo "🚀 Starting Skyfalke Backend Deployment Preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the server directory"
    exit 1
fi

# Create production environment file
echo "📝 Creating production environment file..."
cat > .env.production << 'EOF'
# Production Environment Variables for cPanel
NODE_ENV=production
PORT=5000

# MongoDB Connection (Use your production MongoDB)
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

# CORS Configuration (Your domain)
CORS_ORIGIN=https://skyfalke.com,https://www.skyfalke.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Trust Proxy (for cPanel)
TRUST_PROXY=true
EOF

echo "✅ Production environment file created: .env.production"

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf skyfalke-backend-deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=*.log \
    --exclude=.env \
    --exclude=.env.local \
    --exclude=.env.development \
    .

echo "✅ Deployment package created: skyfalke-backend-deploy.tar.gz"

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > DEPLOY_INSTRUCTIONS.md << 'EOF'
# 🚀 Quick cPanel Deployment Instructions

## 1. Upload to cPanel
- Upload `skyfalke-backend-deploy.tar.gz` to your cPanel
- Extract in `/home/username/nodeapps/skyfalke-backend/`

## 2. Set Environment Variables
- Copy `.env.production` to `.env`
- Or set variables in cPanel Node.js app settings

## 3. Install Dependencies
```bash
cd /home/username/nodeapps/skyfalke-backend
npm install --production
```

## 4. Start App
- In cPanel Node.js settings, click "Restart"
- Check logs for any errors

## 5. Test Endpoints
- Health: `https://yourdomain.com:5000/api/health`
- Blogs: `https://yourdomain.com:5000/api/blogs`

## 6. Update Frontend
Set in your React app:
```env
REACT_APP_API_URL=https://yourdomain.com:5000
```

## 🎯 Expected Result
- ✅ Blog creation works
- ✅ Image uploads work
- ✅ Blog management functional
EOF

echo "✅ Deployment instructions created: DEPLOY_INSTRUCTIONS.md"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📦 Files created:"
echo "   - .env.production (production environment)"
echo "   - skyfalke-backend-deploy.tar.gz (deployment package)"
echo "   - DEPLOY_INSTRUCTIONS.md (deployment guide)"
echo ""
echo "🚀 Next steps:"
echo "   1. Upload skyfalke-backend-deploy.tar.gz to cPanel"
echo "   2. Extract and follow DEPLOY_INSTRUCTIONS.md"
echo "   3. Set environment variables"
echo "   4. Install dependencies and start app"
echo ""
echo "📚 Full guide: CPANEL_DEPLOYMENT.md"
echo ""
echo "Good luck with your deployment! 🚀"
