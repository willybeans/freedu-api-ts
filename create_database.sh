#!/bin/bash

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "Error: psql command not found. Please make sure PostgreSQL is installed."
    exit 1
fi

# PostgreSQL database credentials
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="test_db"
DB_USER="postgres"
DB_PASSWORD="password"

# SQL statements to create the database, table, and insert test data
SQL_CREATE_DB="CREATE DATABASE $DB_NAME;"
SQL_CREATE_TABLE="CREATE TABLE users (
    id INT,
    username TEXT,
    password TEXT
);"
SQL_CREATE_SEQUENCE="CREATE SEQUENCE id_seq
  START WITH 1
  INCREMENT BY 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;
"
SQL_INSERT_DATA="INSERT INTO users (id, username, password) VALUES
  (1, 'JohnDoe', 'pass123'),
  (2, 'JaneSmith', 'secret456'),
  (3, 'BobJohnson', 'password789');
"

# Create the database
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "$SQL_CREATE_DB"

# Create the table
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_CREATE_TABLE"

# Create Sequence
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_CREATE_SEQUENCE"

# Insert test data
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_INSERT_DATA"
