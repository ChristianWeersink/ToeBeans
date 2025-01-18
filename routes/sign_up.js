const express = require('express');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
    title = "Sign up";
    res.render('sign_up', { title });
});

module.exports = router;