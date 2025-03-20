const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "Search for Vets | Toebeans Vet Finder";
    res.render('map', { title });
});


module.exports = router;