const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "Settings";
    res.render('settings', { title }); // This renders views/settings.ejs
});

module.exports = router;
