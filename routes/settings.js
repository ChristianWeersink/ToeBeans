const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route for the homepage
router.get('/', (req, res) => {

    try {
    title = "Settings | Toebeans Vet Finder";
    res.render('settings', { title }); // This renders views/settings.ejs
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

        if (!userCookie || !userCookie.user_id) {
            return res.redirect("/sign_in"); // Redirect if user is not logged in
        }
    }

    catch (error) {

    }
});

//For Theme Retrieval 
router.get('/gettheme', async (req, res) => {
    const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = user.user_id;
    const selection = "SELECT selected_theme FROM users WHERE user_id = $1";
    const themeResults = await db.query(selection, [userId]);
    if(themeResults.rowCount > 0){
        res.json({success: true, theme: themeResults.rows[0]});
    }else{
        res.status(400).json({message: "No user data :(", success: false});
    }
        
});

router.post('/', async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

        if (!userCookie || !userCookie.user_id) {
            return res.redirect("/sign_in"); // Redirect if user is not logged in
        }
    
    console.log("Request Body", req.body);
    const selectedtheme = req.body.theme;

    console.log(selectedtheme, "selected");


    const userID = userCookie.user_id;

    if (!userID) {
        return res.status(401).json({ success: false, message: "User not signed in"});
    }
    const update = "UPDATE users SET selected_theme = $1 WHERE user_id = $2";

    db.query(update, [selectedtheme, userID], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Theme could not be updated"});
        }
        res.status(200).json({success: true, message:"Theme successfully updated to: "+ selectedtheme});
    });

});

router.delete('/', async (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    if (!userCookie || !userCookie.user_id) {
        return res.redirect("/sign_in");
    }

    const userID = userCookie.user_id;

    try {
        await db.query("DELETE FROM users WHERE user_id = $1", [userID]);
        res.clearCookie("user"); // Clear user session
        res.status(200).json({ success: true, message: "Account and related data deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Server error during deletion." });
    }
});

module.exports = router;
