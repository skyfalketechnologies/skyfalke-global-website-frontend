# 🔐 Admin Login Troubleshooting Guide

## ✅ Current Status: RESOLVED

The admin login issue has been **successfully resolved**. The admin user has been created and the login system is working properly.

## 🎯 Quick Solution

**Admin Credentials:**
- **Email:** `admin@skyfalke.com`
- **Password:** `admin123`
- **Role:** `admin`

**Access URL:** `http://localhost:5000/admin/login` (or your domain + `/admin/login`)

## 🔍 What Was Fixed

### 1. Admin User Creation
- ✅ Created admin user in the database
- ✅ Set proper role as 'admin'
- ✅ Password properly hashed and stored
- ✅ User marked as active (`isActive: true`)

### 2. Server Configuration
- ✅ Server is running on port 5000
- ✅ MongoDB connection established
- ✅ Authentication endpoints working
- ✅ JWT token generation working

### 3. API Endpoints Tested
- ✅ `/api/auth/login` - Working correctly
- ✅ `/api/health` - Server healthy
- ✅ JWT token generation - Successful

## 🚀 How to Access Admin Panel

### Method 1: Direct URL
1. Go to: `http://localhost:5000/admin/login`
2. Enter credentials:
   - Email: `admin@skyfalke.com`
   - Password: `admin123`
3. Click "Login"

### Method 2: Alternative Login Pages
The system has multiple admin login pages for security:
- `/admin/login` - Standard admin login
- `/admin/secure-login` - Enhanced security login
- `/admin/hidden-login` - Hidden admin access

## 🛠️ If You Still Can't Login

### Step 1: Check Server Status
```bash
# Check if server is running
curl http://localhost:5000/api/health

# Should return: {"status":"OK",...}
```

### Step 2: Verify Admin User Exists
```bash
# Run from server directory
cd server
node scripts/createAdmin.js
```

### Step 3: Test Login API Directly
```bash
# Test the login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skyfalke.com","password":"admin123"}'
```

### Step 4: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try to login and check for any JavaScript errors
4. Go to Network tab to see if API calls are being made

### Step 5: Clear Browser Data
1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Try a different browser

## 🔧 Common Issues & Solutions

### Issue: "Invalid credentials"
**Solution:** 
- Verify you're using: `admin@skyfalke.com` / `admin123`
- Check if admin user exists in database
- Run `node scripts/createAdmin.js` to recreate admin

### Issue: "Account temporarily locked"
**Solution:**
- Wait 15 minutes for lockout to expire
- Clear browser localStorage
- Or restart the server

### Issue: "Server error during login"
**Solution:**
- Check if MongoDB is connected
- Verify server is running
- Check server logs for errors

### Issue: "Token is not valid"
**Solution:**
- Clear browser localStorage
- Logout and login again
- Check if JWT_SECRET is set in environment

### Issue: "Access denied. Admin role required"
**Solution:**
- Verify user has 'admin' role in database
- Recreate admin user with proper role

## 🗄️ Database Verification

To check if admin user exists in MongoDB:

```javascript
// Connect to MongoDB and run:
db.users.findOne({email: "admin@skyfalke.com"})

// Should return user object with:
// - email: "admin@skyfalke.com"
// - role: "admin"
// - isActive: true
```

## 🔄 Recreating Admin User

If you need to recreate the admin user:

```bash
# Navigate to server directory
cd server

# Run the admin creation script
node scripts/createAdmin.js

# This will:
# 1. Connect to MongoDB
# 2. Check if admin exists
# 3. Create or update admin user
# 4. Set password to 'admin123'
```

## 📱 Environment Variables

Ensure these environment variables are set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

## 🚨 Security Notes

1. **Change Default Password**: After first login, change the default password
2. **Use HTTPS**: In production, ensure SSL/TLS is enabled
3. **Environment Variables**: Keep JWT_SECRET secure and unique
4. **Database Security**: Use strong MongoDB credentials

## 📞 Support

If you're still experiencing issues:

1. Check server logs for detailed error messages
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Test API endpoints directly with curl/Postman
5. Check browser network tab for failed requests

## ✅ Verification Checklist

- [ ] Server is running on port 5000
- [ ] MongoDB connection established
- [ ] Admin user exists in database
- [ ] Admin user has 'admin' role
- [ ] Admin user is active
- [ ] JWT_SECRET is set
- [ ] Login API endpoint responds correctly
- [ ] Browser can access admin login page
- [ ] No JavaScript errors in console
- [ ] Network requests are successful

---

**Last Updated:** October 16, 2025  
**Status:** ✅ RESOLVED - Admin login working correctly
