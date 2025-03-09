const express = require("express");
const router = express.Router();
const db = require("../config/db");
const GOOGLE_PLACES_API_KEY = process.env.MAPS_PLATFORM_KEY;
const axios = require('axios'); // To call Google Places API

// Route to display pet, user, and vet info via QR Code
router.get("/:id", async (req, res) => {
    try {
        const petId = req.params.id;

        // Fetch pet info
        const petQuery = `
            SELECT pets.*, users.user_name, users.user_phone, users.user_email, users.isname_public, users.isphone_public, users.isemail_public
            FROM pets 
            JOIN users ON pets.user_id = users.user_id
            WHERE pets.id = $1;
        `;
        const petResult = await db.query(petQuery, [petId]);

        if (petResult.rowCount === 0) {
            return res.status(404).render("qr_code", { title: "Pet Not Found", pet: null, vet: null });
        }

        const pet = petResult.rows[0];

        // Fetch vet info if a home vet exists
        let vet = null;
        if (pet.pet_homevet_id) {
            vet = await fetchVetDetails(pet.pet_homevet_id);
        }

        // Pass data to the QR display page
        res.render("qr_code", { title: pet.pet_name, pet, vet });

    } catch (error) {
        console.error("Error fetching pet info:", error);
        res.status(500).send("Internal Server Error");
    }
});


const fetchVetDetails = async (placeId) => {
    if (!placeId) return {
        name: "No home vet selected",
        phone: "No home vet selected",
    };
    
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,opening_hours,website,geometry,formatted_address&key=${GOOGLE_PLACES_API_KEY}`;
        const { data } = await axios.get(url);

        if (data.status === "OK" && data.result.name) {
            return {
                name: data.result.name || "Unknown Vet",
                phone: data.result.formatted_phone_number || "No phone number available",
                website: data.result.website || "Website not available",
                opening_hours: data.result.opening_hours || "Hours not available",
                location: data.result.geometry.location,
                address: data.result.formatted_address || "Address not available"
                
            };
        } else {
            console.error(`Google Places API Error: ${data.status}`);
            return { name: "Unknown Vet", phone: "No phone number available" };
        }
    } catch (error) {
        console.error(`Error fetching vet name for place_id ${placeId}:`, error);
        return { name: "Unknown Vet", phone: "No phone number available" };
    }
};

module.exports = router;
