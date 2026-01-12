# Knot Canvas - GitHub Setup Script
# This script helps you quickly set up and deploy the project to GitHub

Write-Host "🪢 Knot Canvas - GitHub Deployment Setup" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Check if Git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "   https://git-scm.com/download/win`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git is installed`n" -ForegroundColor Green

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

# Get repository name (with default)
$repoName = Read-Host "Enter repository name (default: knot-canvas)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "knot-canvas"
}

Write-Host "`n📦 Setting up Git repository..." -ForegroundColor Yellow

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: 3D Parametric Knot Viewer"

# Add remote origin
$remoteUrl = "https://github.com/$username/$repoName.git"
git remote add origin $remoteUrl

Write-Host "✅ Git repository initialized`n" -ForegroundColor Green

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "============`n" -ForegroundColor Cyan

Write-Host "1️⃣  Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   👉 Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "   👉 Repository name: $repoName" -ForegroundColor Yellow
Write-Host "   👉 Make it Public (for free Cloudflare Pages hosting)" -ForegroundColor Yellow
Write-Host "   👉 Do NOT initialize with README, .gitignore, or license`n" -ForegroundColor Yellow

Write-Host "2️⃣  Push your code to GitHub:" -ForegroundColor White
Write-Host "   Run this command:" -ForegroundColor Yellow
Write-Host "   git push -u origin main`n" -ForegroundColor Cyan

Write-Host "3️⃣  Deploy to Cloudflare Pages:" -ForegroundColor White
Write-Host "   👉 Go to: https://dash.cloudflare.com/" -ForegroundColor Yellow
Write-Host "   👉 Navigate to: Workers & Pages > Create Application > Pages" -ForegroundColor Yellow
Write-Host "   👉 Connect to Git > Select your repository" -ForegroundColor Yellow
Write-Host "   👉 Build settings:" -ForegroundColor Yellow
Write-Host "      - Build command: npm run build" -ForegroundColor Cyan
Write-Host "      - Build output directory: dist" -ForegroundColor Cyan
Write-Host "   👉 Click 'Save and Deploy'`n" -ForegroundColor Yellow

Write-Host "🎉 Your app will be live at: https://$repoName.pages.dev`n" -ForegroundColor Green

Write-Host "📝 Optional: Custom Domain" -ForegroundColor White
Write-Host "   You can add a custom domain in Cloudflare Pages settings`n" -ForegroundColor Gray

# Ask if user wants to open GitHub
$openGitHub = Read-Host "Would you like to open GitHub now to create the repository? (Y/n)"
if ($openGitHub -ne 'n' -and $openGitHub -ne 'N') {
    Start-Process "https://github.com/new"
}

Write-Host "`n✨ Setup complete! Good luck with your knot visualizations! 🪢" -ForegroundColor Green
