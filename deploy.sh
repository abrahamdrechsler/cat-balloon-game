#!/bin/bash
# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  # Create assets directory
  mkdir -p dist/public/assets

  # Copy sound files directly from source to the correct location
  if [ -d "attached_assets" ]; then
    cp attached_assets/meow2.m4a attached_assets/meow3.m4a attached_assets/Recording.m4a "attached_assets/Recording (3).m4a" dist/public/assets/
  fi

  # Ensure we're in the dist directory
  cd dist

  # Fix asset paths in index.html if it exists
  if [ -f "public/index.html" ]; then
    sed -i 's|src="/assets/|src="./assets/|g' public/index.html
    sed -i 's|href="/assets/|href="./assets/|g' public/index.html
  fi

  echo "Successfully prepared files for static deployment"
  ls -la public/assets/
else
  echo "Build failed"
  exit 1
fi