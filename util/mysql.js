const mysql = require('mysql');

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: 'cloudclub',
  connectionLimit: 50,
  charset: 'utf8mb4',
});

database.getConnection((err, conn) => {
  if (err) throw err;
  conn.ping((err2) => {
    conn.release();
    if (err2) throw err2;
  });
});

module.exports = database;
