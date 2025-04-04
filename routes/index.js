const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "Home Page | Toebeans Vet Finder";
    res.render('index', { title }); // This renders views/index.ejs
});

//Renders cookies page using the base '/' route so we dont have a million files that do nothing
router.get('/cookies', (req, res) =>{
    title = "Cookie Policy | Toebeans Vet Finder";
    res.render('cookies', { title });
});
// render terms
router.get('/terms', (req, res) =>{
    title = "Terms and Conditions | Toebeans Vet Finder";
    res.render('terms', { title });
});
// Renders Privacy Policy page
router.get('/privacypolicy', (req, res) =>{
    title = "Privacy Policy | Toebeans Vet Finder";
    res.render('privacypolicy', { title });
});
// Renders Contact Us page
router.get('/contactus', (req, res) =>{
    title = "Contact Us | Toebeans Vet Finder";
    res.render('contactus', { title });
});

module.exports = router;
