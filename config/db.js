const { Pool } = require('pg');
var db;
try{
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10, // 10 concurrent connections
        idleTimeoutMillis: 30000, // Automatically close idle connections after 30 seconds
        connectionTimeoutMillis: 5000 // Timeout if connection takes too long
    });
}
catch(error){
    console.log("Error creating client"+error);
}
// Specifies database configuration mostly from .env file


// Connects to local database
db.connect()
    .then(() => console.log("Database connection successful"))
    .catch(error => console.error("Database connection failed", error));

module.exports = db;