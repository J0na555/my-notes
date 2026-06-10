#!/usr/bin/env bash
set -euo pipefail

# ─── Config ──────────────────────────────────────────────
VAULT="$HOME/Documents/projects/my-notes/content"
PORTFOLIO="$HOME/Documents/projects/v3/src/content/writing"

# Files matching these patterns (case-insensitive) are skipped
IGNORE_PATTERNS=(
  "_templates"
  ".obsidian"
  "index.md"
)

# ─── Helpers ─────────────────────────────────────────────
log()  { printf "\033[1;32m✓\033[0m %s\n" "$1"; }
warn() { printf "\033[1;33m⚠\033[0m %s\n" "$1" >&2; }

should_ignore() {
  local file="$1"
  for pattern in "${IGNORE_PATTERNS[@]}"; do
    if [[ "$file" == *"$pattern"* ]]; then
      return 0
    fi
  done
  return 1
}

strip_obsidian_fields() {
  local file="$1"
  python3 -c "
import sys, re, yaml

with open(sys.argv[1]) as f:
  raw = f.read()

# Extract frontmatter
m = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)', raw, re.DOTALL)
if not m:
  sys.stdout.write(raw)
  sys.exit(0)

frontmatter_raw, body = m.group(1), m.group(2)

try:
  fm = yaml.safe_load(frontmatter_raw) or {}
except yaml.YAMLError:
  sys.stdout.write(raw)
  sys.exit(0)

# Fields to keep for the portfolio
keep_fields = {'title', 'date', 'meta', 'dek'}
# Normalize keys (strip trailing colons from malformed keys like "title:")
new_fm = {k.rstrip(':'): v for k, v in fm.items() if k.rstrip(':') in keep_fields}

# Merge back
if new_fm:
  out = '---\n' + yaml.dump(new_fm, allow_unicode=True, sort_keys=False).strip() + '\n---\n\n' + body.lstrip()
else:
  out = body.lstrip()

sys.stdout.write(out)
" "$file"
}

sanitize_filename() {
  local name="$1"
  # Remove emoji and other non-ASCII noise, replace spaces with hyphens
  name=$(echo "$name" | sed 's/[^a-zA-Z0-9._-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
  echo "${name,,}"
}

# ─── Main ────────────────────────────────────────────────
count=0
skipped=0

while IFS= read -r -d '' file; do
  relpath="${file#$VAULT/}"
  basename=$(basename "$file" .md)
  dirpath=$(dirname "$relpath")

  if should_ignore "$relpath"; then
    continue
  fi

  # Check for publish: true in frontmatter (very fast grep)
  if ! grep -qE '^publish:\s*"?true"?' "$file" 2>/dev/null; then
    continue
  fi

  # Sanitize the filename for portfolio
  safe_name=$(sanitize_filename "$basename")
  out_name="${safe_name}.md"

  # Handle nested dirs by flattening with a prefix to avoid collisions
  if [[ "$dirpath" != "." ]]; then
    dir_prefix=$(sanitize_filename "$dirpath")
    out_name="${dir_prefix}-${out_name}"
  fi

  out_path="$PORTFOLIO/$out_name"

  if [[ -f "$out_path" ]]; then
    warn "Skipping (already exists): $out_name"
    ((skipped++))
    continue
  fi

  # Strip Obsidian-specific frontmatter and copy
  strip_obsidian_fields "$file" > "$out_path"

  log "Published: $relpath → $out_name"
  ((count++))
done < <(find "$VAULT" -name '*.md' -print0)

echo ""
echo "Done. $count published, $skipped skipped."
