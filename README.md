# Cereal Stylesheets

## The Stylesheets of Champions

The goal of this project is to be a source for generating a CSS Custom Properties collection and a utility class library that can be used in any project. The intent is that it generates a file that can the be incorporated into other system or used on its own.

I am bringing together what I like from other similar libraries and my own preferences on a tool like this.

---

## Creating A Release

Cereal Stylesheets follow semantic versioning and has scripts built-in to handle release increments. This process will handle git

- **Major Release** `npm run release-major`
- **Minor Release** `npm run release-minor`
- **Patch Release** `npm run release-patch`
- **Beta Release** `npm run release-beta`
- **Alpha Release** `npm run release-alpha`

### Information about how release creation works

- **Pre-release Handling:** The script checks if the current version is a pre-release (contains -alpha or -beta). If so, it extracts the pre-release identifier.
- **Version Increment:** The script increments the appropriate version component based on the argument (major, minor, patch, alpha, or beta).
  - For alpha and beta releases, it increments the pre-release identifier.
  - If switching from a non-pre-release to a pre-release, it increments the patch version and starts the pre-release identifier at 0.
- **Version Construction:** The script constructs the new version, appending the pre-release identifier if present.
- **Version Update:** The script updates the version in package.json, commits the change, tags the new version, and pushes the changes and tags to the repository.
- **Changelog Update:** The script generates or updates the changelog with commit messages since the last version, commits the changelog, and pushes the changelog commit.
