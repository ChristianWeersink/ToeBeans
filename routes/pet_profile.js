const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "pet_profile";
    res.render('pet_profile', { title }); // This renders views/profile.ejs
});

module.exports = router;
