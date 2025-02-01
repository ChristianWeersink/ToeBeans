const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Route for the homepage
router.get('/', (req, res) => {
    title = "Sign up";
    res.render('sign_up', {user_id: null});
});

router.post('/sign_up', (req, res) => {
    // Collect user data from the form
    const {name, userphone, useremail} = req.body;

    // Insert the collected data into the database
    const insert = 'INSERT INTO users (user_name, user_phone, user_email, isname_public, isphone_public, isemail_public) VALUES ($1, $2, $3, false, false, false) RETURNING user_id';

    db.query(insert, [name, userphone, useremail], (error, result) => {
        if (error) {
            console.error(error);
            return res.send("There was an error saving this data");
        }

        const user_id = result.rows[0].user_id;

        res.render("/sign_up", { user_id });
    });
});

router.post('/signup', (req, res) => {
    const {password, username, user_id} = req.body;

    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.error(error);
            return res.send("Error hashing the password!");
        }
    })

    const insert = 'INSERT INTO account_data (user_pass, user_login, user_id) VALUES ($1, $2, $3)';

    db.query(insert, [password, username, user_id], (error, result) => {
        if (error) {
            console.error(error);
            return res.send("There was an error saving this data!");
        }

        res.send("Username and password saved successfully!");
    });
});

module.exports = router;