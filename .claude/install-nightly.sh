#!/bin/bash
# Installs a macOS launchd job that runs the queue every night at 02:00.
# Usage: bash .claude/install-nightly.sh [--uninstall]

PLIST_LABEL="com.clockhash.nightly-queue"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_LABEL.plist"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

if [[ "$1" == "--uninstall" ]]; then
  launchctl unload "$PLIST_PATH" 2>/dev/null
  rm -f "$PLIST_PATH"
  echo "✓ Nightly queue uninstalled."
  exit 0
fi

cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$PLIST_LABEL</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$SCRIPT_DIR/run-queue.sh</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$(dirname "$SCRIPT_DIR")</string>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>2</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/nightly-queue.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/nightly-queue-error.log</string>

  <key>RunAtLoad</key>
  <false/>

  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
  </dict>
</dict>
</plist>
PLIST

launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load "$PLIST_PATH"

echo "✓ Nightly queue installed — runs every night at 02:00"
echo "  Log: $LOG_DIR/nightly-queue.log"
echo "  To uninstall: bash .claude/install-nightly.sh --uninstall"
