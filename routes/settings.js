const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route for the homepage
router.get('/', (req, res) => {
    title = "Settings";
    res.render('settings', { title }); // This renders views/settings.ejs
});

router.post('/themeselection', async (req, res) => {
    const selectedtheme = req.body.theme;

    console.log(selectedtheme, "selected");

    // Edit this for cookies instead of session;
    const userID = req.cookies.cookies.userid;
    const update = "UPDATE users SET selected_theme = $1 WHERE user_id = $2";

    db.query(update, [selectedtheme, user], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Theme could not be updated"});
        }
        res.redirect('/settings');
    });

});

module.exports = router;
