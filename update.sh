#!/bin/bash

node /app/src/builder/buildFullDB.i.js > /var/log/build.log 2>&1
node /app/src/builder/buildReducedDB.i.js  >> /var/log/build.log 2>&1
yarn run build >> /var/log/build.log 2>&1