#!/usr/bin/env bash
set -euo pipefail

PAPER_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$PAPER_DIR/build"
LOG_PATH="$BUILD_DIR/build.log"
ERROR_PATH="$BUILD_DIR/build_errors.md"

mkdir -p "$BUILD_DIR"

if ! command -v tectonic >/dev/null 2>&1; then
  cat >"$ERROR_PATH" <<'EOF'
# Paper Build Error

`tectonic` was not found in `PATH`.

Install `tectonic` first, then rerun:

```bash
bash paper/build_paper.sh
```
EOF
  exit 1
fi

cd "$PAPER_DIR"

if tectonic --outdir "$BUILD_DIR" manuscript.tex >"$LOG_PATH" 2>&1; then
  rm -f "$ERROR_PATH"
else
  {
    echo "# Paper Build Error"
    echo
    echo "The LaTeX build failed. See \`paper/build/build.log\` for the full compiler output."
    echo
    echo '```text'
    tail -n 80 "$LOG_PATH" || true
    echo '```'
  } >"$ERROR_PATH"
  exit 1
fi
