const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route for the homepage
router.get('/', async (req, res) => {
    try {
        // Ensure the user cookie is properly parsed
        const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
        if (!userCookie || !userCookie.user_id) {
            return res.redirect("/sign_in"); // Redirect if user is not logged in
        }

        const userId = userCookie.user_id;
        console.log("User Cookie:", userCookie);
        console.log("User ID:", userId);

        const title = "pet_profile";
        const petQuery = "SELECT * FROM pets WHERE user_id = $1";

        // Correct usage of await db.query() without a callback
        const result = await db.query(petQuery, [userId]);

        // Ensure we return the correct data
        const pets = result.rows || []; // Default to empty array if no pets found
        console.log("Fetched Pets:", pets);

        // Render the EJS template with the correct pets data
        res.render('pet_profile', { title, pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).send("Server Error");
    }
});


router.post('/', (req, res) =>{

})


module.exports = router;
