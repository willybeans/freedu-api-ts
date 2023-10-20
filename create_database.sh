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
SQL_CREATE_USERS="CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
);"
SQL_CREATE_SEQUENCE="CREATE SEQUENCE id_seq
  START WITH 1
  INCREMENT BY 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;
"
SQL_INSERT_DATA="INSERT INTO users (id, username, password) VALUES
  ('d2792a62-86a4-4c49-a909-b1e762c683a3', 'JohnDoe'),
  ('fc1b7d29-6aeb-432b-9354-7e4c65f15d4e', 'JaneSmith'),
  ('9f0b1b5f-9cc5-4d14-aa9c-82cbe87e8a95', 'BobJohnson');
"

SQL_CREATE_GAMEROOMS="CREATE TABLE game_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

SQL_CREATE_MESSAGES="CREATE TABLE messages (
  chat_room_id UUID REFERENCES game_rooms(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# Create the database
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "$SQL_CREATE_DB"

# Create the table users
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_CREATE_USERS"

# Create the table game Rooms
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_CREATE_GAMEROOMS"

# Create Sequence
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_CREATE_SEQUENCE"

# Insert test data
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_INSERT_DATA"

# Insert test data
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$SQL_CREATE_MESSAGES"
