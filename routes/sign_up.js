const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Route for the homepage
router.get('/', (req, res) => {
    title = "Sign up";
    res.render('sign_up', {title});
});

router.post('/', (req, res) => {
    // Collect user data from the form
    const {name, userphone, useremail, username, userpass} = req.body;

    bcrypt.hash(userpass, 10, (error, hashedPass) => {
        if (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Error hashing the password!"});
        }
    // Insert the collected data into the database
    const insert = 'INSERT INTO users (user_name, user_phone, user_email, isname_public, isphone_public, isemail_public, user_login, user_pass) VALUES ($1, $2, $3, false, false, false, $4, $5) RETURNING user_id';

    db.query(insert, [name, userphone, useremail, username, hashedPass], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "There was an error saving this data"});
        }

        res.status(200).json({success: true, message: "Sign up successful!"});
    });
});
});


module.exports = router;