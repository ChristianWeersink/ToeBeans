const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route for the shop
router.get('/', (req, res) => {

    try {
    title = "Shop | Toebeans Vet Finder";
    res.render('shop', { title }); // This renders views/shop.ejs
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    }

    catch (error) {

    }
});

module.exports = router;