# How to Create a Super Admin User

There are several ways to create a super admin user in the Skyfalke system:

## Method 1: Using the NPM Script (Recommended)

The easiest way is to use the npm script that's already configured:

```bash
cd server
npm run create-super-admin
```

This will create a super admin with the default credentials:
- **Email:** mronald@skyfalke.com
- **Password:** SuperAdmin123!
- **Name:** Super Admin

### Custom Credentials

You can also provide custom credentials as command-line arguments:

```bash
npm run create-super-admin -- <email> <password> <name>
```

Example:
```bash
npm run create-super-admin -- admin@example.com MySecurePass123 "Admin Name"
```

## Method 2: Direct Node Script Execution

You can run the script directly with Node.js:

```bash
cd server
node scripts/set-super-admin.js
```

Or with custom credentials:
```bash
node scripts/set-super-admin.js admin@example.com MyPassword123 "Admin Name"
```

## Method 3: Create Regular Admin First, Then Upgrade

1. First, create a regular admin user:
```bash
cd server
npm run create-admin
```

2. Then upgrade that user to super admin:
```bash
npm run create-super-admin -- admin@skyfalke.com
```

## Method 4: Through the API (After Initial Setup)

Once you have at least one admin user, you can:

1. Log in to the admin panel
2. Navigate to the admin user management (if available)
3. Or use the registration endpoint to create a new user, then upgrade it

## Method 5: MongoDB Direct (Advanced)

If you have direct MongoDB access, you can create a user directly:

```javascript
// Connect to MongoDB
use skyfalke

// Create super admin user
db.users.insertOne({
  name: "Super Admin",
  email: "mronald@skyfalke.com",
  password: "$2a$12$...", // Hashed password (use bcrypt)
  role: "super_admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** You'll need to hash the password using bcrypt. It's easier to use one of the methods above.

## Important Notes

1. **Default Super Admin Email:** The system recognizes `mronald@skyfalke.com` as a super admin regardless of the role field in the database (for backward compatibility).

2. **Password Requirements:** 
   - Minimum 6 characters
   - Will be automatically hashed using bcrypt

3. **Super Admin Privileges:**
   - Access to HR Management section
   - Access to Accounting & Finance section
   - Can approve financial transactions
   - Can approve expenses and financial reports
   - Can create and manage employees
   - Can access system settings

4. **Security:** After creating the super admin, make sure to:
   - Change the default password immediately
   - Use a strong, unique password
   - Keep the credentials secure

## Verification

After creating the super admin, you can verify by:

1. Logging in to the admin panel at `/system/portal/access`
2. Checking that you can see:
   - HR Management section in the sidebar
   - Accounting & Finance section in the sidebar
   - System Settings in the Settings page

## Troubleshooting

If you encounter issues:

1. **Connection Error:** Make sure MongoDB is running and the connection string in `.env` is correct
2. **User Already Exists:** The script will update the existing user to super_admin role
3. **Permission Denied:** Make sure you have write access to the MongoDB database

## Environment Variables

Make sure your `.env` file has the correct MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/skyfalke
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skyfalke
```

