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

    // Edit this for cookies instead of session
    const userID = req.session.userid;
    const update = "UPDATE users SET selectedtheme = $1 WHERE user_id = $2";

    db.query(update, [selectedtheme, userID], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Theme could not be updated");
        }

        res.redirect('/settings');
    });

});

module.exports = router;
