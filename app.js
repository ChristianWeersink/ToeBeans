const express = require("express");
const axios = require("axios");
const path = require("path");
const cookieParser = require('cookie-parser');
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(cookieParser());

// Middleware to serve static files (like CSS, JS, or HTML)
app.use(express.static(path.join(__dirname, "public")));
// May not be needed
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SET UP ROUTES HERE. WE WILL CONFIGURE THE ROUTES IN THE FOLDER CALLED ROUTES FOR EVERY PAGE
// Import routes
const indexRoutes = require('./routes/index');
const signUpRoutes = require('./routes/sign_up');
const mapRoutes = require('./routes/map');
const mapApiRoutes = require('./routes/map_api');
const userProfileRoutes = require('./routes/profile');
const petProfileRoutes = require('./routes/pet_profile');
const userSettingsRoutes = require('./routes/settings');
const signInRoutes = require('./routes/sign_in');
const signOutRoutes = require('./routes/sign_out');
const favouritesRoutes = require('./routes/favourites');
const qrRoutes = require('./routes/qr_code');
// Use routes
app.use('/', indexRoutes); // when / is loaded (the home page of the website) it uses the index.js route set up in /routes
app.use('/sign_up', signUpRoutes);
app.use('/map', mapRoutes);
app.use(mapApiRoutes);
app.use('/profile', userProfileRoutes); 
app.use('/pet_profile', petProfileRoutes);
app.use('/settings', userSettingsRoutes);
app.use('/sign_in', signInRoutes);
app.use('/sign_out',  signOutRoutes);
app.use('/favourites', favouritesRoutes);
app.use('/qr_code', qrRoutes);







// Handle 404 Errors (This MUST be placed at the bottom)
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

