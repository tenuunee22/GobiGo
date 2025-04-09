#!/bin/bash
# Simple script to deploy GobiGo to GitHub Pages

echo "Building application for GitHub Pages..."
npm run build

echo "Creating a GitHub Pages structure..."
mkdir -p dist/assets
cp -r dist/public/* dist/

# Create a simple index.html for GitHub Pages
cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GobiGo Food Delivery</title>
    <meta http-equiv="refresh" content="0;url=./public/index.html">
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
      }
      .loader {
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 5px solid white;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div>
      <div class="loader"></div>
      <h2>Redirecting to GobiGo...</h2>
      <p>If you are not redirected automatically, <a href="./public/index.html" style="color: white; text-decoration: underline;">click here</a>.</p>
    </div>
  </body>
</html>
EOL

echo "Done! Your application is ready to be deployed to GitHub Pages."
echo "Now commit and push your changes to GitHub."