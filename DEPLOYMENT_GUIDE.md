# 🚀 Deployment Guide - SimplifiED

Complete step-by-step guide to deploy your SimplifiED application.

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Render account (sign up at https://render.com)
4. Your project pushed to GitHub

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
cd C:\Users\Pushkar\Desktop\Final-SimplifiED
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `simplified-app` (or any name you prefer)
3. **DO NOT** initialize with README (your project already has files)
4. Copy the repository URL

### Step 3: Push to GitHub

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend on Render

### Step 1: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `simplified-app` repository

### Step 2: Configure Service Settings

**Basic Settings:**
- **Name:** `simplified-backend` (or your choice)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend-python`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables

Click **"Environment"** tab and add:

```
GROQ_API_KEY=your_groq_api_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
```

**Note:** Use your actual API keys (the ones from your `.env` files)

**Note:** You'll update `FRONTEND_URL` after deploying frontend (Step 4 below)

### Step 4: Add Firebase Service Account

In Render dashboard:
1. Click **"Environment"** → **"Secret Files"**
2. Add new secret file:
   - **Filename:** `serviceAccountKey.json`
   - **Contents:** Paste your entire Firebase service account JSON content

**Copy the entire contents from your `backend-python/serviceAccountKey.json` file**

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://simplified-backend.onrender.com`
4. **Copy this URL** - you'll need it for frontend!

### Step 6: Test Backend

Visit: `https://YOUR-BACKEND-URL.onrender.com/health`

Should return:
```json
{"status": "ok", "groq_model": "llama-3.3-70b-versatile"}
```

✅ Backend deployed successfully!

---

## Part 3: Deploy Frontend on Vercel

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `simplified-app` repository
4. Click **"Import"**

### Step 2: Configure Build Settings

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `dist` (auto-detected)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

#### Firebase Configuration:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Copy these values from your `frontend/.env` file**

#### Backend API URL:
```
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com/api
```

**Important:** Replace `YOUR-RENDER-BACKEND-URL` with your actual Render backend URL from Part 2!

#### AssemblyAI (Optionayour_assemblyai_api_key
```
VITE_ASSEMBLYAI_API_KEY=9ba104a300a44693b01593e4345ba085
```

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-5 minutes for build and deployment
3. You'll get a URL like: `https://simplified-app.vercel.app`

✅ Frontend deployed successfully!

---

## Part 4: Final Configuration

### Step 1: Update Backend CORS

Now that you have your Vercel URL, go back to Render:

1. Go to your backend service on Render
2. Click **"Environment"**
3. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Save and redeploy

### Step 2: Test the Application

1. Visit your Vercel URL: `https://your-vercel-app.vercel.app`
2. Sign up / Log in
3. Try recording audio or entering text
4. Verify all features work

---

## 🎯 Deployment URLs Summary

After deployment, you'll have:

- **Frontend:** `https://your-app-name.vercel.app`
- **Backend API:** `https://your-backend-name.onrender.com`

---

## 🔧 Troubleshooting

### Backend Issues:

**Problem:** 500 errors when processing
- **Solution:** Check Render logs for API key issues
- Verify GROQ_API_KEY is set correctly
- Check Firebase serviceAccountKey.json is uploaded

**Problem:** CORS errors
- **Solution:** Ensure FRONTEND_URL matches your Vercel URL exactly
- Redeploy backend after updating environment variables

### Frontend Issues:

**Problem:** Can't connect to backend
- **Solution:** Verify VITE_API_URL is correct in Vercel
- Check backend is deployed and running on Render
- Ensure `/api` is included in the URL

**Problem:** Firebase errors
- **Solution:** Double-check all VITE_FIREBASE_* variables
- Verify they're set for Production environment in Vercel

---

## 📝 Important Notes

1. **Render Free Tier:** Backend may sleep after 15 min of inactivity (first request takes ~30 seconds to wake up)
2. **Vercel Free Tier:** Unlimited deployments, perfect for frontend
3. **Security:** Never commit `.env` files or API keys to GitHub
4. **Updates:** Push to GitHub main branch to trigger automatic redeployment

---

## 🔄 Updating Your App

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

- Vercel will auto-deploy frontend changes
- Render will auto-deploy backend changes

---

## ✅ Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Render backend deployed and running
- [ ] Backend environment variables configured
- [ ] Firebase serviceAccountKey.json uploaded to Render
- [ ] Backend URL copied
- [ ] Vercel frontend deployed
- [ ] Frontend environment variables configured
- [ ] Backend CORS updated with Vercel URL
- [ ] Application tested and working

---

## 🎉 You're Live!

Your SimplifiED application is now deployed and accessible worldwide!

**Need help?** Check the logs:
- **Vercel:** Project → Deployments → Click deployment → View logs
- **Render:** Dashboard → Your service → Logs tab

---

**Made with ❤️ using Vercel + Render + Firebase + GROQ AI**
