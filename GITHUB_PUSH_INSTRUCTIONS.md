# GitHub Push Instructions - Step by Step

Since Git is not installed on your system, follow these steps:

## Step 1: Install Git

1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (click "Next" through all prompts)
4. After installation, **restart PowerShell**

## Step 2: Verify Git Installation

Open a new PowerShell window and run:

```powershell
git --version
```

You should see something like `git version 2.x.x`

## Step 3: Configure Git (First Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email (use your GitHub email).

## Step 4: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon in top right → "New repository"
3. Repository name: `aayush-recruitment-platform` (or any name you like)
4. Description: "AI-powered recruitment platform with Next.js 14"
5. **Keep it PUBLIC** (or choose Private if you prefer)
6. **DO NOT check** "Initialize this repository with a README"
7. Click "Create repository"
8. **Copy the repository URL** shown (e.g., `https://github.com/your-username/aayush-recruitment-platform.git`)

## Step 5: Push Your Code to GitHub

Open PowerShell in your project directory and run these commands **one by one**:

```powershell
# Navigate to your project
cd "C:\Users\LENOVO\Desktop\aa"

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: AI-powered recruitment platform"

# Rename branch to main
git branch -M main

# Add your GitHub repository (REPLACE WITH YOUR ACTUAL URL!)
git remote add origin https://github.com/YOUR-USERNAME/aayush-recruitment-platform.git

# Push to GitHub
git push -u origin main
```

**IMPORTANT**: In the second-to-last command, replace `YOUR-USERNAME` with your actual GitHub username and the repo name if you chose a different one.

## Step 6: Authenticate with GitHub

When you run `git push`, you'll be prompted to login:

### Option A: Browser Authentication (Recommended)
- A browser window will open
- Click "Authorize Git Credential Manager"
- Login with your GitHub credentials

### Option B: Personal Access Token
If browser auth doesn't work:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy the token
5. When prompted for password, paste the token instead

## Step 7: Verify on GitHub

1. Go to your repository on GitHub
2. Refresh the page
3. You should see all your files!

## Step 8: Deploy to Vercel

Now follow the `DEPLOYMENT_GUIDE.md` file starting from "Part 2: Deploy to Vercel"

---

## Quick Reference Commands

After initial setup, use these for future updates:

```powershell
# Make changes to your code, then:

git add .
git commit -m "Description of what you changed"
git push
```

That's it! Vercel will automatically deploy your changes.

---

## Troubleshooting

### Error: "fatal: not a git repository"
**Solution**: Make sure you ran `git init` first and you're in the correct directory.

### Error: "Permission denied"
**Solution**: Check your GitHub authentication. Try generating a Personal Access Token.

### Error: "remote origin already exists"
**Solution**: Run `git remote remove origin` then try adding it again.

### Error: "Updates were rejected"
**Solution**: Run `git pull origin main --rebase` then `git push`

---

## What Gets Pushed to GitHub?

✅ All source code files
✅ Configuration files
✅ README.md and documentation
✅ package.json and dependencies list

❌ node_modules/ (too large, not needed)
❌ .env.local (secret keys - NEVER push this!)
❌ .next/ (build files - regenerated on deployment)
❌ PDF files and temporary files

These are automatically excluded via `.gitignore`

---

## Security Reminder

🔒 **NEVER commit these to GitHub:**
- `.env.local` file
- MongoDB connection strings
- JWT secrets
- API keys
- Passwords

Always use environment variables in deployment platforms!

---

Need help? Check:
- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
