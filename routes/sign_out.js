const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    title = "Sign Out | Toebeans Vet Finder";
    res.render('sign_out', { title });
});

module.exports = router;