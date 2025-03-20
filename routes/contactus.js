const express = require("express");
const router = express.Router();
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const Domain = process.env.MAILGUN_DOMAIN;
const receivingEmail = process.env.RECEIVING_EMAIL;



// Setup for Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_KEY
})

router.post('/', async (req, res) => {
    const {name, email, subject, message} = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({success: false, error: "All fields must be filled in."});
    } 

    // Try to send message through Mailgun client
    try {
        const mailmessage = await mg.messages.create(Domain, {
            from: `toebeans@sandbox06e8b8b4de184c25a73e01fb75b59919.mailgun.org`,
            to: receivingEmail,
            subject: `Subject: ${subject}`,
            text: `From ${name} at <${email}>: \n${message}`
        });

        res.json({success: true, message: "Message Sent!"});
    } catch (error){
        console.error("Error sending through Mailgun service", error);
        res.status(500).json({success: false, error: "Message failed to send.", details: error.message});
    }
});

module.exports = router;