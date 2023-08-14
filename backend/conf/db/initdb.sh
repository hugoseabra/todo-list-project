#!/usr/bin/env bash

set -e

psql -v
ON_ERROR_STOP=1
--username "$POSTGRES_USER"
--dbname "$POSTGRES_DB" <<-EOSQL
CREATE DATABASE db ENCODING UTF8;
EOSQL
