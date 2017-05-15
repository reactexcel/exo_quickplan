#! /bin/bash

set -e

# Install ArangoDB v3.0
brew update
brew uninstall arangodb --force
brew install arangodb

# Create databases and collections
/usr/local/sbin/arangod&
npm run update
npm install -g babel-cli
babel-node server/index.js

# Install Foxx
git clone -b migrate-v3 https://github.com/uncircled/bbt.git
cd bbt/APP
npm install
cd ../..
foxx-manager install bbt /bbt --server.database exo-dev --server.password ''
rm -rf bbt

echo "ArangoDB v3.0 has been migrated successfully"
