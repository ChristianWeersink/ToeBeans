const { Client } = require('pg');

// Specifies database configuration mostly from .env file
const db = new Client({
    connectionString: process.env.SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Connects to local database
db.connect()
    .then(() => console.log("Database connection successful"))
    .catch(error => console.error("Database connection failed", error));

module.exports = db;