# Noam's Game Hub — Mac app

A small Mac app that opens noamtoder.com in its own window (own Dock icon, menu,
offline screen, stays signed in).

## Releasing a new version
1. Change `"version"` in `package.json` (e.g. 1.0.1).
2. Commit, then push a tag that matches: `git tag app-v1.0.1 && git push origin app-v1.0.1`.
3. GitHub Actions builds it on a Mac and publishes a release with:
   - `NoamsGameHub-mac-arm64.dmg` / `.zip` (Apple Silicon — M1, M2, M3, M4…)
   - `NoamsGameHub-mac-x64.dmg` / `.zip` (older Intel Macs)

The download page at noamtoder.com/app always links to the newest release.
Apps already installed see an "update available" message within a day.
