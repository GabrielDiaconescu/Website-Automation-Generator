#!/usr/bin/env bash
#
# Applies the migrations and seed to a PostgreSQL database, then runs the
# tenant isolation assertions in supabase/tests/rls.sql.
#
#   npm run db:test                      throwaway local cluster
#   TEST_DATABASE_URL=... npm run db:test  an existing database
#
# Against a database that already provides Supabase's auth schema the shim is
# skipped, so the same assertions can be pointed at a real project.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATION_DIR="$ROOT/supabase/migrations"
SHIM="$ROOT/supabase/tests/00_local_auth_shim.sql"
SEED="$ROOT/supabase/seed.sql"
TESTS="$ROOT/supabase/tests/rls.sql"

CLUSTER_DIR=""
SOCKET_DIR=""
PG_BIN=""
RUN_AS=""

log() { printf '\n\033[1m%s\033[0m\n' "$*"; }

as_pg_user() {
  if [[ -n "$RUN_AS" ]]; then
    su "$RUN_AS" -c "$1"
  else
    bash -c "$1"
  fi
}

cleanup() {
  if [[ -n "$CLUSTER_DIR" && -d "$CLUSTER_DIR" ]]; then
    as_pg_user "'$PG_BIN/pg_ctl' -D '$CLUSTER_DIR' -m immediate stop" >/dev/null 2>&1 || true
    rm -rf "$CLUSTER_DIR" "$SOCKET_DIR"
  fi
}
trap cleanup EXIT

if [[ -z "${TEST_DATABASE_URL:-}" ]]; then
  PG_BIN="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1 || true)"
  if [[ -z "$PG_BIN" ]]; then
    echo "No local PostgreSQL found. Set TEST_DATABASE_URL to run against an existing database." >&2
    exit 1
  fi

  # initdb refuses to run as root, so a throwaway cluster is started as the
  # system postgres user when this script is invoked with uid 0.
  if [[ "$(id -u)" -eq 0 ]]; then
    RUN_AS="postgres"
  fi

  CLUSTER_DIR="$(mktemp -d)"
  SOCKET_DIR="$(mktemp -d)"
  PORT="$(( (RANDOM % 20000) + 40000 ))"

  if [[ -n "$RUN_AS" ]]; then
    chown "$RUN_AS" "$CLUSTER_DIR" "$SOCKET_DIR"
  fi

  log "Starting a throwaway PostgreSQL cluster on port $PORT"
  as_pg_user "'$PG_BIN/initdb' -D '$CLUSTER_DIR' -U postgres --auth=trust" >/dev/null
  as_pg_user "'$PG_BIN/pg_ctl' -D '$CLUSTER_DIR' -o '-p $PORT -k \"$SOCKET_DIR\" -c listen_addresses=' -w start" >/dev/null

  export PGHOST="$SOCKET_DIR"
  export PGPORT="$PORT"
  export PGUSER="postgres"
  export PGDATABASE="postgres"
  PSQL=(psql -v ON_ERROR_STOP=1 --quiet)
else
  log "Using TEST_DATABASE_URL"
  PSQL=(psql -v ON_ERROR_STOP=1 --quiet "$TEST_DATABASE_URL")
fi

has_supabase_auth="$("${PSQL[@]}" -tAc "select to_regproc('auth.uid') is not null")"
if [[ "$has_supabase_auth" != "t" ]]; then
  log "No auth.uid() present — applying the local auth shim"
  "${PSQL[@]}" -f "$SHIM"
else
  log "auth.uid() present — skipping the local auth shim"
fi

log "Applying migrations"
for migration in "$MIGRATION_DIR"/*.sql; do
  echo "  $(basename "$migration")"
  "${PSQL[@]}" -f "$migration"
done

log "Loading seed data"
"${PSQL[@]}" -f "$SEED"

log "Running tenant isolation assertions"
"${PSQL[@]}" -f "$TESTS"
