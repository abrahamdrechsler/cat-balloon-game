#!/bin/bash

# Build the project with GitHub Pages base URL if GITHUB_PAGES is set
if [ "$GITHUB_PAGES" = "true" ]; then
  VITE_BASE_URL="/cat-balloon-game/" npm run build
else
  npm run build
fi

# Check if build succeeded
if [ $? -eq 0 ]; then
  echo "Build completed successfully"

  # Copy files from dist/public to dist, preserving directory structure
  cp -r dist/public/* dist/

  # Clean up the public directory and server bundle
  rm -rf dist/public
  rm -f dist/index.js

  echo "Deployment files prepared successfully"
  echo "Contents of dist directory:"
  ls -la dist/
else
  echo "Build failed"
  exit 1
fi