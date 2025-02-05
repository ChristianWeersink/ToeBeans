const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

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
// Use routes
app.use('/', indexRoutes); // when / is loaded (the home page of the website) it uses the index.js route set up in /routes
app.use('/sign_up', signUpRoutes);
app.use('/map', mapRoutes);
app.use(mapApiRoutes);
app.use('/profile', userProfileRoutes); 
app.use('/pet_profile', petProfileRoutes);
app.use('/settings', userSettingsRoutes);


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
