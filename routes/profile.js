const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route for the homepage
router.get('/', async (req, res) => {
    try {
        // Retrieve `user_id` from cookies
        const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
        if (!userCookie || !userCookie.user_id) {
            return res.redirect("/sign_in"); // Redirect if user is not logged in
        }

        const userId = userCookie.user_id;
        const title = "Profile";

        // Query the database for user details
        const userQuery = "SELECT * FROM users WHERE user_id = $1";
        const result = await db.query(userQuery, [userId]);

        if (result.rowCount === 0) {
            return res.status(404).send("User not found.");
        }

        // Render the profile page with user data
        res.render('profile', { title, user: result.rows[0] });

    } catch (error) {
        console.error("Error querying database:", error);
        res.status(500).send("Internal Server Error");
    }
});




router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { user_name, user_phone, user_email, isname_public, isphone_public, isemail_public } = req.body;

        const updateQuery = `
            UPDATE users
            SET user_name = $1, user_phone = $2, user_email = $3, 
                isname_public = $4, isphone_public = $5, isemail_public = $6
            WHERE user_id = $7
            RETURNING *;
        `;
        const values = [user_name, user_phone, user_email, isname_public, isphone_public, isemail_public, userId];

        const result = await db.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully!" });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
});
 
module.exports = router;
