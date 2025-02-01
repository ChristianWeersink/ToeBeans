const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route for the homepage
router.get('/', (req, res) => {
    title = "profile";

    // This will test to see if the database can be queried
    db.query("SELECT * FROM users")
        .then(result => {
            res.render('profile', { title, users: result.rows }); // This renders views/profile.ejs
        })
        .catch(error => {
            console.error("Error: can't query database", error);
            res.status(500).send("Internal Server Error");
        });

    
});
 
module.exports = router;
