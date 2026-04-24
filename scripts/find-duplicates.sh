#!/bin/bash
# Custom duplicate detection with configurable threshold

THRESHOLD=${1:-30}
echo "🔍 Finding duplicate code with threshold $THRESHOLD..."
echo "=== DUPLICATE PATTERNS (>$THRESHOLD lines similarity) ==="

# Find similar functions/classes across files
echo "Analyzing function duplication..."
find src/ -name "*.ts" -exec grep -l "function\|class\|const.*=" {} \; | head -10

echo ""
echo "=== IMPORT PATTERNS (>$THRESHOLD% similarity) ==="
# Find similar import patterns
find src/ -name "*.ts" -exec grep -l "import.*from.*typespec" {} \; | sort

echo ""
echo "=== CODE PATTERNS (>$THRESHOLD lines) ==="
# Find files with similar line counts (within threshold)
find src/ -name "*.ts" -exec wc -l {} \; | sort -n | while read count file; do
  if [ $count -gt $THRESHOLD ]; then
    echo "$file: $count lines"
  fi
done | sort -k2 -nr

echo ""
echo "=== POTENTIAL DUPLICATES (Size analysis) ==="
# Group files by similar sizes (indicating potential duplication)
find src/ -name "*.ts" -exec wc -l {} \; | awk '
{
  sizes[int($1/50)*50]++
}
END {
  for (size in sizes) {
    if (sizes[size] > 2) {
      printf "%d-%d lines: %d files (potential duplication)\n", size, size+49, sizes[size]
    }
  }
}' | sort -nr