const { Client } = require('pg'); // eslint-disable-line

const pgclient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_CLIENT_PASSWORD,
  database: process.env.POSTGRES_NAME
});

pgclient.connect();

const sequence =
  'CREATE SEQUENCE id_seq START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE CACHE 1;';
const users =
  'CREATE TABLE users (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, username VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL);';

const games =
  'CREATE TABLE game_rooms (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);';

const messages =
  'CREATE TABLE messages (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, chat_room_id UUID REFERENCES game_rooms(id), user_id UUID REFERENCES users(id), content TEXT NOT NULL, sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);';

const text =
  'INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *';
const values = ['d2792a62-86a4-4c49-a909-b1e762c683a3', 'JohnDoe', 'pass123'];

pgclient.query(users, (err, res) => {
  if (err) throw err;
  console.log('create users table success', res.rows[0]);
});

pgclient.query(games, (err, res) => {
  if (err) throw err;
  console.log('create users game rooms success', res.rows[0]);
});
pgclient.query(messages, (err, res) => {
  if (err) throw err;
  console.log('create messages success', res.rows[0]);
});
pgclient.query(sequence, (err, res) => {
  if (err) throw err;
  console.log('create sequence success', res.rows[0]);
});

pgclient.query(text, values, (err, res) => {
  if (err) throw err;
  console.log('insert users success', res.rows[0]);
});

pgclient.query('SELECT * FROM users', (err, res) => {
  if (err) throw err;
  console.log(err, res.rows); // Print the data in student table
  pgclient.end();
});
