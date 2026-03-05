#!/bin/bash
# Sets branch protection rules on GitHub for the dev branch.
# Requires: gh auth login (already done)

REPO="zigliad/clock-hash"
BRANCH="dev"

echo "Setting branch protection for $REPO/$BRANCH..."

gh api "repos/$REPO/branches/$BRANCH/protection" \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Test & Lint"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":0,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --silent && echo "✓ Branch protection enabled on $BRANCH" || echo "✗ Failed — make sure 'dev' branch exists on GitHub and gh is authenticated"
