#!/bin/bash
# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  # Ensure we're in the dist directory
  cd dist

  # Move the public directory contents up one level if it exists
  if [ -d "public" ]; then
    mv public/* ./ 2>/dev/null
    rm -rf public
  fi

  # Ensure assets directory exists
  mkdir -p assets

  # Fix asset paths in index.html to be relative (if it exists)
  if [ -f "index.html" ]; then
    sed -i 's|src="/assets/|src="./assets/|g' index.html
    sed -i 's|href="/assets/|href="./assets/|g' index.html
    sed -i 's|src="/src/|src="./src/|g' index.html
  fi

  echo "Successfully prepared files for static deployment"
  ls -la
else
  echo "Build failed"
  exit 1
fi