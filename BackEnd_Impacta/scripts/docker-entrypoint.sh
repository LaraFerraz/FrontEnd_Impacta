#!/bin/bash
set -e

if [ ! -z "$DB_HOST" ] && [ "$DB_HOST" != "localhost" ]; then
  for i in {1..30}; do
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
      break
    fi
    if [ $i -eq 30 ]; then
      exit 1
    fi
    sleep 2
  done
  sleep 3
fi

node src/initDb.js 2>/dev/null || true
node scripts/populate-db.js 2>/dev/null || true

exec node src/index.js
