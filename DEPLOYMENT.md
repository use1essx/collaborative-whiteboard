# 🚀 Quick Deployment Guide

## Deploy to Vercel in 3 Steps

### Step 1: Prepare Your Code

If you haven't already, initialize a git repository:

```bash
git init
git add .
git commit -m "Initial commit - collaborative whiteboard"
```

### Step 2: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Push your code:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Click "Deploy" (no configuration needed!)

**That's it!** 🎉

Vercel will give you a URL like: `https://your-project.vercel.app`

## Share with Your Groupmates

Just send them the URL! They can:
- ✅ Draw and write on the whiteboard
- ✅ See what you're drawing in real-time
- ✅ All changes sync automatically
- ✅ No login required

## Test Locally First

Before deploying, test it locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in multiple browser windows to test collaboration!

## Troubleshooting

**Build fails on Vercel?**
- Make sure all files are committed and pushed
- Check that Node.js version is 18+ in your `package.json`

**Not syncing?**
- The free tier of Vercel serverless functions should work fine
- Drawings sync every 1 second automatically

**Need help?**
- Check the main README.md
- Open an issue on your GitHub repo
- Vercel has great documentation at [vercel.com/docs](https://vercel.com/docs)

---

Happy Collaborating! 🎨

