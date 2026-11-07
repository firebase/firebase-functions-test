#!/bin/bash
set -e

printusage() {
  echo "publish.sh <version> [use-oss-gate]"
  echo "REPOSITORY_ORG and REPOSITORY_NAME should be set in the environment."
  echo "e.g. REPOSITORY_ORG=user, REPOSITORY_NAME=repo"
  echo ""
  echo "Arguments:"
  echo "  version: 'patch', 'minor', or 'major'."
  echo "  use-oss-gate: 'true' (default false)"
}

VERSION=$1
if [[ $VERSION == "" ]]; then
  printusage
  exit 1
elif [[ ! ($VERSION == "patch" || $VERSION == "minor" || $VERSION == "major") ]]; then
  printusage
  exit 1
fi

USE_OSS_GATE=false
if [[ "$2" == "true" ]]; then
  USE_OSS_GATE=true
fi

if [[ $REPOSITORY_ORG == "" ]]; then
  printusage
  exit 1
fi
if [[ $REPOSITORY_NAME == "" ]]; then
  printusage
  exit 1
fi

WDIR=$(pwd)

echo "Checking for commands..."
trap "echo 'Missing hub.'; exit 1" ERR
which hub &> /dev/null
trap - ERR

trap "echo 'Missing node.'; exit 1" ERR
which node &> /dev/null
trap - ERR

trap "echo 'Missing jq.'; exit 1" ERR
which jq &> /dev/null
trap - ERR
echo "Checked for commands."

# N.B: This will start failing when the wombat creds go away.
# TODO(vsfan@): Leaving it like this as a forcing function to update publish.sh and remove publishConfig.registry.
echo "Checking for logged-in npm user..."
trap "echo 'Please login to npm using \`npm login --registry https://wombat-dressing-room.appspot.com\`'; exit 1" ERR
npm whoami --registry https://wombat-dressing-room.appspot.com
trap - ERR
echo "Checked for logged-in npm user."

echo "Moving to temporary directory.."
TEMPDIR=$(mktemp -d)
echo "[DEBUG] ${TEMPDIR}"
cd "${TEMPDIR}"
echo "Moved to temporary directory."

echo "Cloning repository..."
git clone "git@github.com:${REPOSITORY_ORG}/${REPOSITORY_NAME}.git"
cd "${REPOSITORY_NAME}"
echo "Cloned repository."

echo "Making sure there is a changelog..."
if [ ! -s CHANGELOG.md ]; then
  echo "CHANGELOG.md is empty. aborting."
  exit 1
fi
echo "Made sure there is a changelog."

echo "Running npm ci..."
npm ci
echo "Ran npm ci."

echo "Running tests..."
npm test
echo "Ran tests."

echo "Running publish build..."
npm run build:release
echo "Ran publish build."

echo "Making a $VERSION version..."
npm version $VERSION
NEW_VERSION=$(jq -r ".version" package.json)
echo "Made a $VERSION version."

echo "Making the release notes..."
RELEASE_NOTES_FILE=$(mktemp)
echo "[DEBUG] ${RELEASE_NOTES_FILE}"
echo "v${NEW_VERSION}" >> "${RELEASE_NOTES_FILE}"
echo "" >> "${RELEASE_NOTES_FILE}"
cat CHANGELOG.md >> "${RELEASE_NOTES_FILE}"
echo "Made the release notes."

if [ "$USE_OSS_GATE" = true ]; then
  echo "Configuring NPM to release to OSS Exit Gate..."
  # Install the auth helper without saving to package.json.
  npm install --no-save google-artifactregistry-auth

  # Configure .npmrc for Artifact Registry
  echo "registry=https://us-npm.pkg.dev/oss-exit-gate-prod/firebase-functions-test--npm/" >> .npmrc
  echo "//us-npm.pkg.dev/oss-exit-gate-prod/firebase-functions-test--npm/:always-auth=true" >> .npmrc

  # Authenticate with Artifact Registry
  npx google-artifactregistry-auth

  # Remove the hardcoded Wombat registry from publishConfig
  # TODO(vsfan): Once we're confident in Exit Gate, remove from package.json
  npm pkg delete publishConfig.registry
fi

echo "Publishing to npm..."
if [[ $DRY_RUN == "" ]]; then
  npm publish
else
  echo "DRY RUN: running publish with --dry-run"
  npm publish --dry-run
fi
echo "Published to npm."

if [ "$USE_OSS_GATE" = true ]; then
  git checkout -- package.json
  PACKAGE_NAME=$(jq -r '.name' package.json)
  NPM_TAGS='["latest"]'
  jq -n \
    --arg name "$PACKAGE_NAME" \
    --arg version "$NEW_VERSION" \
    --argjson tags "$NPM_TAGS" \
    '{
      publish_all: false,
      publishing_groups: [{ packages: [{ name: $name, version: $version }] }],
      registry_config: { npm: { tags: $tags } }
    }' > manifest.json
  echo "Manifest generated to trigger Exit Gate publishing:"
  cat manifest.json
  cp manifest.json "$WDIR/manifest.json"
fi

if [[ $DRY_RUN != "" ]]; then
  echo "All other commands are mutations, and we are doing a dry run."
  echo "Terminating."
  exit
fi

echo "Cleaning up release notes..."
rm CHANGELOG.md
touch CHANGELOG.md
git commit -m "[firebase-release] Removed change log and reset repo after ${NEW_VERSION} release" CHANGELOG.md
echo "Cleaned up release notes."

echo "Pushing to GitHub..."
git push origin master --tags
echo "Pushed to GitHub."

echo "Publishing release notes..."
hub release create --file "${RELEASE_NOTES_FILE}" "v${NEW_VERSION}"
echo "Published release notes."
