#!/usr/bin/env sh
# Delegate to the companion mock so demo credentials are never exposed by generic JSON Server CRUD.
set -eu
script_directory=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mock_server="$script_directory/../../molinex-platform-mock/server.js"
if [ ! -f "$mock_server" ]; then
  printf '%s\n' 'Extract the companion molinex-platform-mock project beside the webapp first.' >&2
  exit 1
fi
exec node "$mock_server"
