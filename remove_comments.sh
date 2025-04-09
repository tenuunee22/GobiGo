#!/bin/bash

# Find all TypeScript and TypeScript React files
FILES=$(find client/src -type f -name "*.tsx" -o -name "*.ts")

for FILE in $FILES; do
  # Remove single-line comments (not inside strings)
  sed -i 's|//.*$||g' "$FILE"
  
  # Remove multi-line comments
  # This is a simple approach and might not work perfectly for all cases
  sed -i 's|/\*.*\*/||g' "$FILE"
  
  # Clean up empty lines created by removing comments
  sed -i '/^[[:space:]]*$/d' "$FILE"
  
  echo "Processed: $FILE"
done

echo "All comments removed!"