// db.js
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

module.exports = { query,
  pool };




/*
const odbc = require("odbc");

const connectionString = `DSN=DBNILAI_DSN`;

let connection = null;

//Kalau sudah connect, jangan connect ulang (gak stabil)

async function getConnection() {
  if (!connection) {
    connection = await odbc.connect(connectionString);
  }
  return connection;
}

async function query(sql) {
  const conn = await getConnection();
  const result = await conn.query(sql);
  return result;
}

module.exports = { query };
*/

