#!/bin/bash
echo "Updating Stylizer dependencies..."

# Backup current state
git add -A
git commit -m "chore: backup before dependency update" || true

# Update dependencies
bun outdated
echo "Running updates..."
bunx npm-check-updates -i

# Reinstall
bun install

# Test build
echo "Testing build..."
bun run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Please test the extension in Spotify before committing"
else
    echo "❌ Build failed - check errors above"
    exit 1
fi