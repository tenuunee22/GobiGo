#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Move to the build output directory
cd dist

# Create a .nojekyll file to bypass Jekyll processing
touch .nojekyll

# If you are deploying to a custom domain
# echo "yourdomain.com" > CNAME

# Initialize Git repository if not already exists
if [ ! -d .git ]; then
  git init
  git checkout -b main
  git remote add origin https://github.com/username/gobigo-food-delivery.git
fi

# Add all files to Git
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch
git push -f origin main:gh-pages

echo "Deployed successfully to GitHub Pages!"