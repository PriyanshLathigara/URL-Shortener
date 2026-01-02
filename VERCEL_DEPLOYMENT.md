# 🚀 Vercel Deployment Guide

## ✅ Your App is Now Vercel-Ready!

The application has been configured for Vercel deployment with all necessary files.

## 📋 Pre-Deployment Checklist

### 1. MongoDB Setup
- [ ] Set up MongoDB Atlas (free tier available) or use your existing MongoDB
- [ ] Get your MongoDB connection string
- [ ] Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for Atlas)

### 2. Environment Variables
You'll need to set these in Vercel dashboard:
- `MONGO_URL` - Your MongoDB connection string
- `secret` - A strong random string for JWT signing
- `NODE_ENV` - Set to `production` (optional, Vercel sets this automatically)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com)** and sign in with GitHub

2. **Import Your Repository**
   - Click "Add New Project"
   - Select your `URL-Shortener` repository
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Other (or Node.js)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable:
     ```
     MONGO_URL = your_mongodb_connection_string
     secret = your_strong_secret_key
     NODE_ENV = production
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts and add environment variables when asked.

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Files Created

### `vercel.json`
- Routes all requests to the serverless function
- Configures the build process

### `api/index.js`
- Serverless function entry point for Vercel
- Exports the Express app

### Modified `app.js`
- Now exports the app for serverless use
- Still works for local development

## ⚠️ Important Notes

### MongoDB Connection
- **MongoDB Atlas**: Make sure to whitelist `0.0.0.0/0` or Vercel's IP ranges
- **Connection String**: Use the full connection string from MongoDB Atlas
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### Session Storage
- Current setup uses in-memory sessions
- For production, consider using MongoDB session store or Redis
- For now, sessions will reset on serverless function cold starts

### Cold Starts
- Vercel serverless functions may have cold starts
- First request after inactivity may be slower
- MongoDB connection is maintained per function instance

### Environment Variables
- **Never commit `.env` file** (already in `.gitignore`)
- Set all variables in Vercel dashboard
- Variables are encrypted and secure

## 🐛 Troubleshooting

### Deployment Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### App Works Locally but Not on Vercel
- Check environment variables in Vercel dashboard
- Verify MongoDB allows connections from Vercel
- Check function logs in Vercel dashboard

### Database Connection Issues
- Verify MongoDB Atlas network access (whitelist IPs)
- Check connection string format
- Ensure database user has proper permissions

## 📝 Post-Deployment

1. **Test Your Deployment**
   - Visit your Vercel URL
   - Test signup/login
   - Test URL shortening
   - Test URL redirection

2. **Monitor**
   - Check Vercel dashboard for logs
   - Monitor function execution times
   - Watch for errors

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS settings
   - SSL is automatic with Vercel

## 🎉 Success!

Your URL Shortener is now deployed on Vercel! Share your live URL with others.

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [Express on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)

