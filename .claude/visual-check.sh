#!/bin/bash
# Spins up the dev server, takes screenshots at mobile + desktop breakpoints,
# saves them to .claude/screenshots/ for Claude to inspect during Self-CR.
# Usage: bash .claude/visual-check.sh

set -e

SCRIPT_DIR="$(dirname "$0")"
ROOT_DIR="$SCRIPT_DIR/.."
SCREENSHOTS_DIR="$SCRIPT_DIR/screenshots"
mkdir -p "$SCREENSHOTS_DIR"

echo "── Visual Check ──────────────────────────────"

# Start dev server in background
echo "Starting dev server..."
npm --prefix "$ROOT_DIR" run dev -- --port 5199 &
DEV_PID=$!

# Ensure cleanup on exit
trap "kill $DEV_PID 2>/dev/null; true" EXIT

# Wait for server to be ready (max 20s)
for i in $(seq 1 20); do
  if curl -s http://localhost:5199 > /dev/null 2>&1; then
    echo "✓ Dev server ready"
    break
  fi
  sleep 1
  if [ "$i" -eq 20 ]; then
    echo "✗ Dev server did not start in time"
    exit 1
  fi
done

# Take screenshots via Playwright node script
node - <<'JS'
const { chromium } = require('@playwright/test')

;(async () => {
  const browser = await chromium.launch()
  const screenshotsDir = `${__dirname}/../.claude/screenshots`

  const viewports = [
    { name: 'mobile',   width: 375,  height: 812 },
    { name: 'desktop',  width: 1280, height: 800 },
  ]

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    await page.goto('http://localhost:5199', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800) // let animations settle
    const file = `${screenshotsDir}/screenshot-${vp.name}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(`✓ Screenshot saved: ${file}`)
    await page.close()
  }

  await browser.close()
})()
JS

echo ""
echo "Screenshots saved to .claude/screenshots/"
echo "Review them for layout issues before proceeding with Self-CR."
echo "──────────────────────────────────────────────"
