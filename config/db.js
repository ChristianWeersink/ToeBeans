const { Client } = require('pg');

// Specifies database configuration mostly from .env file
const db = new Client({
 user: process.env.DB_USER,
 host: '192.168.2.24',
 database: process.env.DB_NAME,
 password: process.env.DB_PASS,
 port: process.env.DB_PORT
});

// Connects to local database
db.connect()
    .then(() => console.log("Database connection successful"))
    .catch(error => console.error("Database connection failed", error));

module.exports = db;