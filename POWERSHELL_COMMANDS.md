# 🚀 Quick PowerShell Commands for GitHub Deployment

## One-Time Setup

### 1. Navigate to your project folder
```powershell
cd "C:\path\to\your\knot-canvas-project"
```

### 2. Run the setup script (Easy Way!)
```powershell
.\setup-github.ps1
```

OR do it manually:

### 3. Manual Git Setup
```powershell
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Knot Canvas 3D Viewer"

# Add your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/knot-canvas.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Testing Locally Before Deploying

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Building for Production

```powershell
# Create production build
npm run build

# Test the production build
npm run preview
```

## After Making Changes

```powershell
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your description of changes"

# Push to GitHub (auto-deploys if using Cloudflare GitHub integration)
git push
```

## Cloudflare Direct Deploy (Alternative)

```powershell
# Install Wrangler (one time only)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build project
npm run build

# Deploy
wrangler pages deploy dist --project-name=knot-canvas
```

## Useful Git Commands

```powershell
# View commit history
git log --oneline

# See current branch
git branch

# Create new branch
git checkout -b feature-name

# Switch back to main
git checkout main

# Pull latest changes
git pull

# Check repository status
git status
```

## Troubleshooting

### If you get "Permission denied"
You need a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use it as your password when prompted

### If you get "Port 5173 already in use"
```powershell
# Kill the process using port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Reset everything (CAREFUL - deletes uncommitted changes!)
```powershell
git reset --hard
git clean -fd
```

## Check Your Deployment

After pushing to GitHub with Cloudflare integration:
- Go to: https://dash.cloudflare.com/
- Navigate to: Workers & Pages
- Click on your project name
- Click on the deployment to see build logs and live URL

Your app will be at: `https://knot-canvas.pages.dev`

## Share with Students

Once deployed, share this URL with your students. They can:
- ✅ Access it from any device with a browser
- ✅ No installation needed
- ✅ Create and download STL files for 3D printing
- ✅ Learn about parametric equations and topology

## Custom Domain (Optional)

If you want to use your school's domain:
1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain (e.g., knots.yourschool.edu)
4. Follow DNS setup instructions

---

Quick Help:
- GitHub: https://github.com
- Cloudflare: https://dash.cloudflare.com
- Docs: See DEPLOYMENT.md for detailed instructions
