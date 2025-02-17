#!/bin/bash

# Build the project
npm run build

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