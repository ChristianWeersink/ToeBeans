const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Route for the homepage
router.get('/', (req, res) => {
    title = "Sign in";
    res.render('sign_in', {title});
});

router.post('/', (req, res) => {
    // Collect user data from the form
    const {username, userpass} = req.body;

// TODO SIGN IN METHOD 
    bcrypt.hash(userpass, 10, (error, hashedPass) => {
        if (error) {
            console.error(error);
            return res.send("Error hashing the password!");
        }

    });
});


module.exports = router;