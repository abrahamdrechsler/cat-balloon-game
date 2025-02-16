#!/bin/bash

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  # Create assets directory if it doesn't exist
  mkdir -p dist/public/assets

  # Define audio files to convert
  declare -a audio_files=(
    "meow2.m4a"
    "meow3.m4a"
    "Recording.m4a"
    "Recording (3).m4a"
  )

  # Convert each audio file
  for file in "${audio_files[@]}"; do
    input_file="attached_assets/$file"
    output_file="dist/public/assets/${file%.m4a}.mp3"

    if [ -f "$input_file" ]; then
      echo "Converting $file to MP3..."
      ffmpeg -y -i "$input_file" \
        -acodec libmp3lame \
        -q:a 2 \
        -ar 44100 \
        -ac 2 \
        -af "aresample=resampler=soxr" \
        "$output_file"

      if [ $? -eq 0 ]; then
        echo "Successfully converted $file"
      else
        echo "Failed to convert $file"
        exit 1
      fi
    else
      echo "Warning: Source file $input_file not found"
    fi
  done

  echo "Successfully prepared files for static deployment"
  echo "Contents of assets directory:"
  ls -la dist/public/assets/
else
  echo "Build failed"
  exit 1
fi