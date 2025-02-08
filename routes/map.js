const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "Map";
    res.render('map', { title });
});


module.exports = router;