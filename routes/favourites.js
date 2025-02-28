const express = require('express');
const router = express.Router();
const db = require('../config/db');
const axios = require('axios'); // To call Google Places API
const GOOGLE_PLACES_API_KEY = process.env.MAPS_PLATFORM_KEY;

router.post('/', async (req, res) => {
    // Collect user data from the form
    const {placeId, userId} = req.body;
    console.log("adding to favourites: " +placeId);
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

// Get only vet ids from database (no places api call)
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

// Get route with api call to get vet names 
router.get('/names', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "No user ID entered." });
        }
        // Fetch favorite vet place_ids
        const getFavourites = "SELECT place_id FROM favourite_vets WHERE user_id = $1";
        const favouritesResult = await db.query(getFavourites, [userId]);

        if (favouritesResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: "No favourites found" });
        }

        // Fetch vet details from Google Places API
        const vetDetails = await Promise.all(favouritesResult.rows.map(async (fav) => {
            const placeId = fav.place_id;
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;

            try {
                const { data } = await axios.get(url);
                if (data.status === "OK") {
                    return {
                        place_id: placeId,
                        name: data.result.name
                    };
                }
            } catch (error) {
                console.error(`Error fetching details for place_id ${placeId}:`, error);
            }
            return null;
        }));

        // Remove null values (failed API calls)
        const validVets = vetDetails.filter(vet => vet !== null);

        return res.status(200).json({ success: true, favourites: validVets });

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
        console.log(`Deleting from favourites: UserID: ${userId}, PlaceID: ${placeId}`);

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