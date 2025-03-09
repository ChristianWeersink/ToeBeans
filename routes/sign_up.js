const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Route for the homepage
router.get('/', (req, res) => {
    title = "Sign up";
    res.render('sign_up', {title});
});

router.post("/", async (req, res) => {
    try {
        // Step 1: Collect user data
        const { name, userphone, useremail, username, userpass } = req.body;

        // Check if username already exists
        const checkUserQuery = "SELECT user_id FROM users WHERE user_login = $1";
        const userExists = await db.query(checkUserQuery, [username]);

        if (userExists.rowCount > 0) {
            return res.status(400).json({ success: false, message: "Username is already taken. Please choose another one." });
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(userpass, 10);

        //Insert new user into the database
        const insertUserQuery = `
            INSERT INTO users (user_name, user_phone, user_email, isname_public, isphone_public, isemail_public, user_login, user_pass)
            VALUES ($1, $2, $3, false, false, false, $4, $5) 
            RETURNING user_id;
        `;
        const result = await db.query(insertUserQuery, [name, userphone, useremail, username, hashedPass]);

        // Respond with success message
        res.status(200).json({ success: true, message: "Sign up successful!" });

    } catch (error) {
        console.error("Sign-up error:", error);
        res.status(500).json({ success: false, message: "An error occurred during sign-up. Please try again later." });
    }
});

module.exports = router;