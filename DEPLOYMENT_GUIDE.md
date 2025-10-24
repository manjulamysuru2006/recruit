# 🚀 Complete Deployment Guide

This guide will walk you through deploying your Aayush Recruitment Platform to Vercel and optionally to Render.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- MongoDB Atlas account (already set up)
- Git installed on your machine

---

## Part 1: Push to GitHub

### Step 1: Create a New GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `aayush-recruitment-platform` (or your preferred name)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"
6. Copy the repository URL (e.g., `https://github.com/your-username/aayush-recruitment-platform.git`)

### Step 2: Initialize Git and Push

Open PowerShell in your project directory and run:

```powershell
# Navigate to project directory
cd "C:\Users\LENOVO\Desktop\aa"

# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Complete recruitment platform with AI matching and messaging"

# Rename branch to main
git branch -M main

# Add remote repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR-USERNAME/aayush-recruitment-platform.git

# Push to GitHub
git push -u origin main
```

**Note**: You may be prompted to log in to GitHub. Use your GitHub credentials.

### Step 3: Verify Upload

1. Go to your GitHub repository in browser
2. Verify all files are there (except those in .gitignore)
3. Check that `.env.local` is **NOT** visible (it should be ignored)

---

## Part 2: Deploy to Vercel

### Step 1: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Find your `aayush-recruitment-platform` repository
3. Click "Import"

### Step 3: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random string (e.g., use https://randomkeygen.com) |
| `NEXT_PUBLIC_APP_URL` | Leave empty for now (will be filled after deployment) |

**Example values:**
```
MONGODB_URI=mongodb+srv://aayush:your-password@cluster0.xxxxx.mongodb.net/recruitment-platform?retryWrites=true&w=majority
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see a success screen with your live URL (e.g., `https://aayush-recruitment-platform.vercel.app`)

### Step 6: Update Environment Variable

1. Go to your project settings on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Edit `NEXT_PUBLIC_APP_URL` and set it to your Vercel URL
4. Click "Save"
5. Redeploy: Go to "Deployments" → Click "..." on latest → "Redeploy"

---

## Part 3: Configure MongoDB Atlas for Vercel

### Step 1: Update Network Access

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Choose "Allow Access from Anywhere"
   - This adds `0.0.0.0/0` (required for Vercel's dynamic IPs)
5. Click "Confirm"

**Security Note**: This is safe for MongoDB Atlas as it still requires username/password authentication.

### Step 2: Verify Connection

1. Visit your Vercel deployment URL
2. Try to register a new account
3. If successful, your database is connected!

---

## Part 4: Testing Your Deployment

### Test Checklist

1. **Homepage**: Visit your Vercel URL
2. **Register**: Create a recruiter account
3. **Login**: Login with new credentials
4. **Post Job**: Create a test job posting
5. **Logout & Register Candidate**: Create a candidate account
6. **Apply**: Apply to the job you created
7. **Message**: Send a message from candidate
8. **Switch to Recruiter**: Login as recruiter, check messages
9. **Verify Persistence**: Refresh page, verify messages still there

---

## Part 5: Deploy to Render (Optional Alternative)

If you prefer Render over Vercel:

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: New Web Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: aayush-recruitment-platform
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

Same as Vercel:
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` (will be your Render URL)

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Update `NEXT_PUBLIC_APP_URL` with your Render URL
4. Redeploy

---

## Part 6: Continuous Deployment

### How It Works

Every time you push to GitHub's `main` branch, Vercel automatically:
1. Detects the change
2. Runs `npm install`
3. Builds the project
4. Deploys the new version

### Making Updates

```powershell
# Make your code changes
# Then:

git add .
git commit -m "Description of changes"
git push
```

Vercel will auto-deploy in 2-3 minutes!

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found` or `Type error`

**Solution**: 
```powershell
# Locally test production build
npm run build
npm start
```
Fix any errors shown, then push again.

### Database Connection Fails

**Error**: `MongoServerError: bad auth`

**Solutions**:
1. Check `MONGODB_URI` is correct in Vercel environment variables
2. Verify MongoDB Atlas username/password
3. Check Network Access allows `0.0.0.0/0`
4. Ensure database user has read/write permissions

### Environment Variables Not Working

**Error**: Variables are undefined in code

**Solutions**:
1. Verify variable names match exactly (case-sensitive)
2. Client-side variables must start with `NEXT_PUBLIC_`
3. After adding/changing env vars, redeploy the project
4. Clear browser cache and try again

### Site is Slow or Crashes

**Cause**: Free tier MongoDB may have connection limits

**Solutions**:
1. Upgrade MongoDB cluster (M10 or higher)
2. Implement connection pooling (already done in `lib/mongodb.ts`)
3. Add database indexes for faster queries

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Buy a domain from Namecheap, GoDaddy, etc.
2. In Vercel project settings → "Domains"
3. Add your domain (e.g., `aayush-recruitment.com`)
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)
6. Update `NEXT_PUBLIC_APP_URL` to your custom domain
7. Redeploy

---

## Security Checklist

- [x] `.env.local` is in `.gitignore`
- [x] Strong `JWT_SECRET` generated
- [x] MongoDB network access configured
- [ ] Enable MongoDB advanced security (optional)
- [ ] Set up monitoring/alerts (optional)
- [ ] Configure rate limiting (for production)
- [ ] Add CAPTCHA to prevent bot registrations (optional)

---

## Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to your Vercel project
2. Navigate to "Analytics" tab
3. Enable Web Analytics
4. View traffic, performance metrics

### MongoDB Atlas Monitoring

1. In Atlas, go to "Metrics"
2. Monitor:
   - Connections
   - Operations per second
   - Storage usage
   - Network traffic

---

## Backup Strategy

### MongoDB Backups

1. MongoDB Atlas automatically creates backups
2. To restore: Atlas → "Backup" → "Restore"

### Code Backups

- GitHub serves as version control backup
- Vercel keeps deployment history (last 30 days on free tier)

---

## Cost Breakdown

### Free Tier
- **Vercel**: Free (generous limits)
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **GitHub**: Free (unlimited public repos)

**Total**: $0/month ✅

### Production Tier (for scale)
- **Vercel Pro**: $20/month (if needed)
- **MongoDB M10**: $57/month (dedicated cluster)
- **GitHub**: Free

---

## Next Steps After Deployment

1. **Share your link**: Send to friends, add to portfolio
2. **Monitor usage**: Check Vercel analytics daily
3. **Gather feedback**: Get users to test
4. **Iterate**: Make improvements based on feedback
5. **Add features**: Implement roadmap items
6. **Scale**: Upgrade when you hit limits

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **GitHub Issues**: Your repo's Issues tab

---

## 🎉 Congratulations!

Your AI-powered recruitment platform is now live on the internet! 🚀

**Your Deployment URLs:**
- Vercel: `https://YOUR-PROJECT.vercel.app`
- GitHub: `https://github.com/YOUR-USERNAME/YOUR-REPO`

Share it, test it, improve it! Good luck! 💪
