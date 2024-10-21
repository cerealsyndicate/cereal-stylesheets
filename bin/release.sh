#!/bin/bash

# Ensure the script exits on any error
set -e

# Check if a version type (major, minor, patch, alpha, beta) is provided
if [ -z "$1" ]; then
  echo "Usage: $0 {major|minor|patch|alpha|beta}"
  exit 1
fi

# Get the current version from package.json
CURRENT_VERSION=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' package.json)
echo "Current version: $CURRENT_VERSION"

# Split the version into its components
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"

# Handle pre-release versions
PRE_RELEASE=""
if [[ "$CURRENT_VERSION" == *-* ]]; then
  PRE_RELEASE=$(echo "$CURRENT_VERSION" | grep -oP '(?<=-)[^"]*')
  CURRENT_VERSION=$(echo "$CURRENT_VERSION" | grep -oP '^[^-]*')
  IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
fi

# Increment the appropriate version component
case "$1" in
  major)
    VERSION_PARTS[0]=$((VERSION_PARTS[0] + 1))
    VERSION_PARTS[1]=0
    VERSION_PARTS[2]=0
    PRE_RELEASE=""
    ;;
  minor)
    VERSION_PARTS[1]=$((VERSION_PARTS[1] + 1))
    VERSION_PARTS[2]=0
    PRE_RELEASE=""
    ;;
  patch)
    VERSION_PARTS[2]=$((VERSION_PARTS[2] + 1))
    PRE_RELEASE=""
    ;;
  alpha)
    if [[ "$PRE_RELEASE" == alpha* ]]; then
      PRE_RELEASE="alpha.$(( ${PRE_RELEASE##*.} + 1 ))"
    else
      VERSION_PARTS[2]=$((VERSION_PARTS[2] + 1))
      PRE_RELEASE="alpha.0"
    fi
    ;;
  beta)
    if [[ "$PRE_RELEASE" == beta* ]]; then
      PRE_RELEASE="beta.$(( ${PRE_RELEASE##*.} + 1 ))"
    else
      VERSION_PARTS[2]=$((VERSION_PARTS[2] + 1))
      PRE_RELEASE="beta.0"
    fi
    ;;
  *)
    echo "Invalid version type: $1"
    exit 1
    ;;
esac

# Construct the new version
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.${VERSION_PARTS[2]}"
if [ -n "$PRE_RELEASE" ]; then
  NEW_VERSION="$NEW_VERSION-$PRE_RELEASE"
fi
echo "New version: $NEW_VERSION"

# Create a new branch for the version update
BRANCH_NAME="release-$NEW_VERSION"
git checkout -b "$BRANCH_NAME"

# Update the version in package.json
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# Commit the version change
git add package.json
git commit -m "chore(release): bump version to $NEW_VERSION"

# Tag the new version
git tag "v$NEW_VERSION"

# Generate or update the changelog
CHANGELOG_CONTENT=$(git log --pretty=format:"- %s (%h)" "v$CURRENT_VERSION"...HEAD)
echo -e "## v$NEW_VERSION\n$CHANGELOG_CONTENT\n\n$(cat CHANGELOG.md)" > CHANGELOG.md

# Commit the changelog
git add CHANGELOG.md
git commit -m "chore(release): update changelog for $NEW_VERSION"

# Push the new branch and tags to the repository
git push origin "$BRANCH_NAME" --tags

echo "Release branch $BRANCH_NAME created and pushed. Please review and merge into main."

# Instructions for merging and pushing tags
echo "After merging the branch into main, run the following command to push the tags to main:"
echo "git push origin --tags"
