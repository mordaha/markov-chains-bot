#!/bin/sh

set -e
ls -al
. ./production.env
echo running: ${APP_MODE}
npm run build && npm run bot
