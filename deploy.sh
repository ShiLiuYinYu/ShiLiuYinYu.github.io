#!/bin/bash
set -e
cd "C:/Users/ASUS/Documents/个人学习资料/blog-static"

# Add .nojekyll so GitHub Pages serves files as-is
touch .nojekyll

# Stage all files
git add -A

# Commit
git commit -m "Migrate blog from WordPress to GitHub Pages"

# Add remote
git remote add origin git@github.com:ShiLiuYinYu/ShiLiuYinYu.github.io.git 2>/dev/null || git remote set-url origin git@github.com:ShiLiuYinYu/ShiLiuYinYu.github.io.git

# Push
git branch -M main
git push -u origin main

echo ""
echo "✅ Blog deployed! Visit: https://shiliuyinyu.github.io"
