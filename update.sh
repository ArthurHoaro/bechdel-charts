#!/bin/bash

node /app/src/builder/buildFullDB.js > /var/log/build.log 2>&1
node /app/src/builder/buildReducedDB.js  >> /var/log/build.log 2>&1
