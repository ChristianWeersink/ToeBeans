const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/get-place-id', async (req, res) => {
    const placeId = req.query.placeId; // Or any other data you need

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`, {
                params: {
                    placeid: placeId,
                    key: process.env.MAPS_PLATFORM_KEY,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching map data' });
    }
});

// Route to provide the API key
router.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.MAPS_PLATFORM_KEY }); // Send the API key
});

router.get('/get-map-data', (req, res) => {
    // You can use geolocation to get the user's location on the server if required, 
    // but for now, you can simply send a default location (e.g., in the frontend you can use `navigator.geolocation`)
    
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };  // Default: San Francisco
    
    // Send the location to the frontend
    res.json(defaultLocation);  
});
// Export the router to be used in app.js
module.exports = router;