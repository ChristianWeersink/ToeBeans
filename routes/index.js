const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "Home Page";
    res.render('index', { title }); // This renders views/index.ejs
});

module.exports = router;
