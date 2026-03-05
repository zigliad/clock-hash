#!/bin/bash
# Sets branch protection rules on GitHub for the dev branch.
# Requires: gh auth login (already done)

REPO="zigliad/clock-hash"
BRANCH="dev"

echo "Setting branch protection for $REPO/$BRANCH..."

echo '{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Test & Lint"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}' | gh api "repos/$REPO/branches/$BRANCH/protection" \
  --method PUT \
  --input - \
  --silent && echo "✓ Branch protection enabled on $BRANCH" || echo "✗ Failed — make sure 'dev' branch exists on GitHub and gh is authenticated"
