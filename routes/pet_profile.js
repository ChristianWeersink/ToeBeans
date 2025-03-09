const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const multer = require('multer'); // Handle file uploads
const fs = require('fs');// handle files
const supabase = require('../config/supaBaseClient');
const upload = multer({ dest: 'uploads/' }); // handle file uploads temporarily
const GOOGLE_PLACES_API_KEY = process.env.MAPS_PLATFORM_KEY;
const axios = require('axios'); // To call Google Places API
const QRCode = require("qrcode");

// Route for the homepage
router.get('/', async (req, res) => {
    try {
        // Ensure the user cookie is properly parsed
        const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
        if (!userCookie || !userCookie.user_id) {
            return res.redirect("/sign_in"); // Redirect if user is not logged in
        }

        const userId = userCookie.user_id;

        const title = "pet_profile";
        const petQuery = "SELECT * FROM pets WHERE user_id = $1";

        // Correct usage of await db.query() without a callback
        const result = await db.query(petQuery, [userId]);

        // Ensure we return the correct data
        const pets = result.rows || []; // Default to empty array if no pets found
        // Render the EJS template with the correct pets data
        
        for (let pet of pets) {
            petinfo = await fetchVetName(pet.pet_homevet_id);
            pet.vet_name = petinfo.name;
            pet.phone = petinfo.phone;
            const qrCodeUrl = await QRCode.toDataURL(`https://toebeans.onrender.com/pet/${pet.id}`);
            pet.qrCode = qrCodeUrl;
        }

        res.render('pet_profile', { title, pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).send("Server Error");
    }
});



// Add pet
router.post('/', upload.single('pet_photo'), async (req, res) => {
    try {
        const { pet_name, pet_breed, pet_age, pet_allergies, pet_other, pet_homevet_id, user_id } = req.body;
        let pet_photo_url = null;

        // Check if file exists
        if (req.file) {
            const fileBuffer = fs.readFileSync(req.file.path);
            const fileName = `pets/${user_id}_${Date.now()}_${req.file.originalname}`;

            // Upload file to Supabase Storage
            const { data, error } = await supabase.storage
                .from('user-images')
                .upload(fileName, fileBuffer, { contentType: req.file.mimetype });

            if (error) {
                console.error("Supabase Upload Error:", error);
                return res.status(500).json({ message: "Failed to upload image to Supabase" });
            }

            // Construct public URL for the uploaded image
            pet_photo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/user-images/${fileName}`;

            // Remove temporary file
            fs.unlinkSync(req.file.path);
        }

        // Insert pet data into PostgreSQL
        const insertQuery = `
            INSERT INTO pets (user_id, pet_name, pet_breed, pet_age, pet_allergy, pet_other, pet_homevet_id, pet_photo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [user_id, pet_name, pet_breed, pet_age, pet_allergies, pet_other, pet_homevet_id, pet_photo_url];
        await db.query(insertQuery, values);

        res.status(201).json({ message: "Pet added successfully!", pet_photo_url });

    } catch (error) {
        console.error("Error adding pet:", error);
        res.status(500).json({ message: "Error adding pet" });
    }
});



// Update Pet Route (PUT)
router.put("/:id", upload.single("pet_photo"), async (req, res) => {
    try {
        const petId = req.params.id;
        const { pet_name, pet_breed, pet_age, pet_allergy, pet_other, pet_homevet_id } = req.body;
        let pet_photo_url = null;

        // If a new file is uploaded, handle Supabase upload
        if (req.file) {
            const fileBuffer = fs.readFileSync(req.file.path);
            const fileName = `pets/${petId}_${Date.now()}_${req.file.originalname}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from("user-images")
                .upload(fileName, fileBuffer, { contentType: req.file.mimetype });

            if (error) {
                console.error("Supabase Upload Error:", error);
                return res.status(500).json({ message: "Failed to upload image to Supabase" });
            }

            pet_photo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/user-images/${fileName}`;

            fs.unlinkSync(req.file.path); // Delete temp file after upload
        }

        // Update pet record in the database
        const updateQuery = `
            UPDATE pets
            SET pet_name = $1, pet_breed = $2, pet_age = $3, pet_allergy = $4, pet_other = $5, pet_homevet_id = $6, pet_photo = COALESCE($7, pet_photo)
            WHERE id = $8
            RETURNING *;
        `;
        const values = [pet_name, pet_breed, pet_age, pet_allergy, pet_other, pet_homevet_id, pet_photo_url, petId];

        const result = await db.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({ message: "Pet updated successfully!", pet: result.rows[0] });

    } catch (error) {
        console.error("Error updating pet:", error);
        res.status(500).json({ message: "Error updating pet" });
    }
});


// DELETE method for a pet
router.delete("/:id", async (req, res) => {
    try {
        const petId = req.params.id;
        const { pet_photo } = req.body; // Get pet's photo URL
        console.log(pet_photo);
        // Step 1: Delete the pet photo from Supabase Storage (if exists)
        if (pet_photo) {
            console.log("attempting to delete photo: "+pet_photo);
            const { error } = await supabase.storage.from("user-images").remove([`${pet_photo}`]);

            if (error) {
                console.error("Supabase Delete Error:", error);
                return res.status(500).json({ message: "Failed to delete image from storage." });
            }
        }

        // Step 2: Delete the pet from the database
        const deleteQuery = "DELETE FROM pets WHERE id = $1 RETURNING *;";
        const result = await db.query(deleteQuery, [petId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }
        console.log("Deleted pet: " + JSON.stringify(result.rows[0]));
        res.status(200).json({ message: "Pet deleted successfully!" });

    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).json({ message: "Error deleting pet" });
    }
});







// Function to fetch vet name and phone from Google Places API maybe should be a middleware
const fetchVetName = async (placeId) => {
    if (!placeId) return {
        name: "No home vet selected",
        phone: "No home vet selected",
    };
    
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number&key=${GOOGLE_PLACES_API_KEY}`;
        const { data } = await axios.get(url);

        if (data.status === "OK" && data.result.name) {
            return {
                name: data.result.name || "Unknown Vet",
                phone: data.result.formatted_phone_number || "No phone number available"
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
