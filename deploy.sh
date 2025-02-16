#!/bin/bash
# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  # Create public/assets directory if it doesn't exist
  mkdir -p dist/public/assets

  # Copy sound files directly to the build output directory
  cp attached_assets/meow2.m4a attached_assets/meow3.m4a attached_assets/Recording.m4a "attached_assets/Recording (3).m4a" dist/public/assets/

  # Fix asset paths in index.html
  if [ -f "dist/public/index.html" ]; then
    sed -i 's|src="/assets/|src="./assets/|g' dist/public/index.html
    sed -i 's|href="/assets/|href="./assets/|g' dist/public/index.html
  fi

  echo "Successfully prepared files for static deployment"
  echo "Contents of assets directory:"
  ls -la dist/public/assets/
else
  echo "Build failed"
  exit 1
fi