#!/bin/bash
notStagedFilePaths="$(git diff --name-only -- '*.js' '*.jsx')"
stagedFilePaths="$(git diff --staged --name-only -- '*.js' '*.jsx')"
allPaths="$notStagedFilePaths $stagedFilePaths"

if [ -n "${allPaths}" ]; then
    echo $modifiedFilePaths
    node_modules/eslint/bin/eslint.js --config .eslintstrict.json --fix --ext .js --ext .jsx $allPaths
fi