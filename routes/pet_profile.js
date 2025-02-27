const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const multer = require('multer'); // Handle file uploads
const fs = require('fs');// handle files
const supabase = require('../config/supaBaseClient');
const upload = multer({ dest: 'uploads/' }); // handle file uploads temporarily

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
        res.render('pet_profile', { title, pets });

    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).send("Server Error");
    }
});


router.post('/', upload.single('pet_photo'), async (req, res) => {
    try {
        const { pet_name, pet_breed, pet_age, pet_allergies, pet_other, home_vet, user_id } = req.body;
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

        // ✅ Insert pet data into PostgreSQL
        const insertQuery = `
            INSERT INTO pets (user_id, pet_name, pet_breed, pet_age, pet_allergy, pet_other, pet_homevet_id, pet_photo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [user_id, pet_name, pet_breed, pet_age, pet_allergies, pet_other, home_vet, pet_photo_url];
        await db.query(insertQuery, values);

        res.status(201).json({ message: "Pet added successfully!", pet_photo_url });

    } catch (error) {
        console.error("Error adding pet:", error);
        res.status(500).json({ message: "Error adding pet" });
    }
});

module.exports = router;
