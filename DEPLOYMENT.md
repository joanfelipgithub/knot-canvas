# Manual Deployment Guide (PowerShell)

## Prerequisites

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or use: `winget install Git.Git`

2. **Create GitHub Account** (if needed):
   - Sign up at: https://github.com/join

3. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Or use: `winget install OpenJS.NodeJS`

## Step-by-Step Deployment

### 1. Initialize Git Repository

Open PowerShell in your project directory and run:

```powershell
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: 3D Parametric Knot Viewer"
```

### 2. Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `knot-canvas` (or your choice)
3. Description: "Interactive 3D parametric knot visualizer with STL export"
4. Make it **Public** (for free Cloudflare Pages hosting)
5. Do **NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 3. Push to GitHub

Replace `YOUR-USERNAME` with your GitHub username:

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/knot-canvas.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)
  - Create token at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)

### 4. Deploy to Cloudflare Pages

#### Option A: GitHub Integration (Recommended)

1. Log in to Cloudflare: https://dash.cloudflare.com/
2. Navigate to: **Workers & Pages**
3. Click: **Create Application** → **Pages** → **Connect to Git**
4. Connect your GitHub account (if not already connected)
5. Select your `knot-canvas` repository
6. Configure build settings:
   ```
   Build command: npm run build
   Build output directory: dist
   ```
7. Click **Save and Deploy**
8. Wait 2-3 minutes for deployment
9. Your app will be live at: `https://knot-canvas.pages.dev`

#### Option B: Direct Upload (No Git Integration)

```powershell
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm install
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=knot-canvas
```

### 5. Test Your Deployment

Visit your live URL (shown in Cloudflare dashboard or terminal output)

Example: `https://knot-canvas.pages.dev`

## Making Updates

After making changes to your code:

```powershell
# Stage changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

If using GitHub integration, Cloudflare will automatically rebuild and deploy!

## Sharing with Students

Once deployed, simply share the URL with your students:
- Example: `https://knot-canvas.pages.dev`
- Or use a custom domain if configured

Students can:
- ✅ Visualize mathematical knots
- ✅ Create custom parametric formulas
- ✅ Download STL files for 3D printing
- ✅ No installation required - works in any browser!

## Custom Domain (Optional)

To use your own domain (e.g., `knots.yourschool.edu`):

1. In Cloudflare Pages, go to your project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Follow the DNS configuration instructions

## Troubleshooting

### "Permission denied" when pushing to GitHub
- Create a Personal Access Token: https://github.com/settings/tokens
- Use the token as your password when prompted

### Build fails on Cloudflare
- Check that `package.json` has correct dependencies
- Verify build command is: `npm run build`
- Check build logs in Cloudflare dashboard

### App doesn't load
- Check browser console for errors (F12)
- Verify all files are in the `dist/` folder after build
- Clear browser cache and try again

## Need Help?

- **GitHub Docs**: https://docs.github.com/
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Vite Docs**: https://vitejs.dev/guide/

---

Happy Teaching! 🪢📐🖨️
