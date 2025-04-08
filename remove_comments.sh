#!/bin/bash

# This script removes all single-line comments (// style) from TypeScript and React files

find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" | while read -r file; do
  # Remove any line that starts with whitespace (or nothing) and then //
  sed -i 's/^\s*\/\/.*$//' "$file"
  
  # Remove inline comments (something // comment)
  sed -i 's/\s*\/\/.*$//' "$file"
  
  # Remove empty lines
  sed -i '/^\s*$/d' "$file"
  
  echo "Removed comments from $file"
done

# Now remove block comments /* ... */ including multi-line ones
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" | while read -r file; do
  # We'll use a safer approach - create a temporary file
  tmp_file=$(mktemp)
  
  # Remove block comments using awk - this handles multi-line comments
  awk 'BEGIN{in_comment=0} 
    /\/\*/ {in_comment=1} 
    /\*\// {in_comment=0; next} 
    !in_comment {print}' "$file" > "$tmp_file"
  
  # Replace the original file with the comment-free version
  mv "$tmp_file" "$file"
  
  echo "Removed block comments from $file"
done
