#!/bin/bash
find src/app/api -name 'route.ts' | while read file; do
  echo "${file/src\/app/}" | sed 's|/route.ts||; s|^|/|'
  grep -E 'export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)' "$file" | sed 's/^/  → /'
  echo
done
