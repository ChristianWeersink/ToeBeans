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

    bcrypt.hash(userpass, 10, async(error, hashedPass) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error hashing the password!");
        }
        console.log(username);
        const userQuery = "SELECT * FROM users WHERE user_login = $1";
        const userResult = await db.query(userQuery, [username]);
        //Check if the user exists
        if (userResult.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Incorrect sign in details." });
        }
        const storedHashedPassword = userResult.rows[0].user_pass;

        // Compare the entered password with the stored hashed password
        const passwordMatch = await bcrypt.compare(userpass, storedHashedPassword);

        if(passwordMatch){
            const user = {
                user_name: userResult.rows[0].user_name,
                user_phone: userResult.rows[0].user_phone,
                user_email: userResult.rows[0].user_email,
                user_id: userResult.rows[0].user_id,
                user_login: userResult.rows[0].user_login,
                user_id: userResult.rows[0].user_id,
                selected_theme: userResult.rows[0].selected_theme

            }
            console.log(user);
            return res.status(200).json({success: true, message:"Sign in successful!", user: user});
        }
        else{
            return res.status(401).json({success: false, message: "Incorrect sign in details."});
        }

    });
});


module.exports = router;