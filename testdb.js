require('dotenv').config();
const db = require("./config/db");
async function testQuery() {
    try {
        // Example query
        const result = await db.query('SELECT * FROM users;');
        console.log(result.rows);

    } catch (error) {
        console.error("Query failed:", error);
    } finally {
        await db.end(); // Close the connection
    }
}

testQuery();
