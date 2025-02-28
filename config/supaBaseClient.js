const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ✅ Use the correct Supabase API URL
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase environment variables! Check your .env file.");
}

// ✅ Correctly initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
if(supabase){
    console.log("Connected to supabase bucket");
}
else{
    console.log("Error connecting to supabase");
}

module.exports = supabase;