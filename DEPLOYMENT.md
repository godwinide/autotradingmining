# Deployment Guide for Vercel

## Why Sessions Weren't Working on Vercel

Vercel uses **serverless functions**, which are stateless. Each request can be handled by a different function instance, so in-memory sessions don't persist. The solution is to use a **persistent session store** like MongoDB.

## Changes Made

1. **Added MongoDB Session Store** (`connect-mongo`)
   - Sessions are now stored in MongoDB instead of memory
   - Sessions persist across serverless function instances

2. **Updated Session Configuration**
   - Added `MongoStore` for persistent sessions
   - Configured secure cookies for production
   - Added proper session secret management

3. **Created Vercel Configuration** (`vercel.json`)
   - Configured Node.js runtime
   - Set up routing for Express app

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

- `MONGO_URI` - Your MongoDB connection string
- `SESSION_SECRET` - A strong random string (generate with `openssl rand -base64 32`)
- `NODE_ENV` - Set to `production`

### 3. Deploy to Vercel

```bash
vercel --prod
```

Or push to your connected Git repository and Vercel will auto-deploy.

## Important Notes

- **MongoDB Atlas**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges
- **Session Secret**: Use a strong, unique secret in production (different from 'secret')
- **HTTPS**: Vercel automatically provides HTTPS, so secure cookies will work properly

## Testing

After deployment:
1. Log in as admin
2. Navigate to different admin pages
3. Refresh the page
4. Session should persist across all actions

## Troubleshooting

If sessions still don't work:
1. Check Vercel logs for errors
2. Verify MongoDB connection string is correct
3. Ensure MongoDB Atlas allows Vercel connections
4. Check that all environment variables are set correctly
