#!/bin/bash

# Set the environment variables you require
export REACT_APP_RENDER_GIT_COMMIT=$RENDER_GIT_COMMIT

# Run npm install with --force
npm install --force

# Run the build command
npm run build