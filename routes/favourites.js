const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.post('/', async (req, res) => {
    // Collect user data from the form
    const {placeId, userId} = req.body;
    console.log(placeId);
    console.log(userId);
    const favouritesQuery = "INSERT INTO favourite_vets (place_id, user_id) VALUES($1, $2)";
    const favouritesResult = await db.query(favouritesQuery, [placeId, userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "There was an error adding your favourites"});
        }
        res.status(200).json({success: true, message: "Added to favourites!"});
    });
});

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "No user ID entered." });
        }

        const getFavourites = "SELECT * FROM favourite_vets WHERE user_id = $1";
        const favouritesResult = await db.query(getFavourites, [userId]);

        if (favouritesResult.rowCount > 0) {
            return res.status(200).json({ success: true, favourites: favouritesResult.rows });
        } else {
            return res.status(404).json({ success: false, message: "No results found" });
        }
    } catch (error) {
        console.error("Error fetching favourites:", error);
        return res.status(500).json({ success: false, message: "An error occurred fetching data." });
    }
});

router.delete('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const placeId = req.query.placeId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "No user ID entered." });
        }
        console.log(`Fetching favourites for user: ${userId}`);

        const delFavourites = "DELETE FROM favourite_vets WHERE user_id = $1 AND place_id = $2 RETURNING *";
        const favouritesResult = await db.query(delFavourites, [userId, placeId]);

        if (favouritesResult.rowCount > 0) {
            return res.status(200).json({ success: true, favourites: favouritesResult.rows });
        } else {
            return res.status(404).json({ success: false, message: "No rows found" });
        }
    } catch (error) {
        console.error("Error fetching favourites:", error);
        return res.status(500).json({ success: false, message: "An error occurred deleting data." });
    }
});

module.exports = router;