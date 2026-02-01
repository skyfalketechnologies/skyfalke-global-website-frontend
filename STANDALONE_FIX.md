# 🔧 Fixing Broken Styling in Standalone Build

## Problem

When running `npm start` with standalone output, pages appear broken with no styling because static files (CSS, images) aren't properly linked.

## Solution

I've created a setup script that automatically links static files after build. Here's what to do:

### Step 1: Rebuild with Setup Script

```bash
cd client
npm run build
```

The `postbuild` script will automatically run `setup-standalone.js` to link static files.

### Step 2: Start the Server

```bash
npm start
```

The static files should now be properly linked and styling should work.

---

## Alternative: Use Development Mode for Local Testing

For local development, it's recommended to use:

```bash
npm run dev
```

This runs Next.js in development mode with hot reload and proper static file serving.

**Use `npm start` only when:**
- Testing the production build locally
- Preparing for deployment
- Verifying standalone build works

---

## Manual Fix (if script doesn't work)

If the automatic setup doesn't work, manually create symlinks:

### On Linux/Mac:
```bash
cd client/.next/standalone
mkdir -p .next
ln -s ../../.next/static .next/static
ln -s ../../public public
```

### On Windows:
```bash
# Use mklink (requires admin) or copy files
cd client\.next\standalone
mkdir .next
xcopy /E /I ..\..\.next\static .next\static
xcopy /E /I ..\..\public public
```

---

## What the Setup Script Does

1. Checks if standalone build exists
2. Creates `.next/static` symlink/copy in standalone directory
3. Creates `public` symlink/copy in standalone directory
4. Handles Windows vs Unix differences (symlinks vs copies)

---

## Verification

After running the setup, verify files exist:

```bash
ls -la .next/standalone/.next/static
ls -la .next/standalone/public
```

If these directories exist, the static files should load correctly.

---

## Still Having Issues?

1. **Clear build cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check browser console** for 404 errors on CSS/JS files

3. **Verify static files exist:**
   ```bash
   ls -la .next/static/chunks/*.css
   ```

4. **Use development mode** for local testing:
   ```bash
   npm run dev
   ```

