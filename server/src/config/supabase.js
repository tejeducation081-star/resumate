const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Helper to clean env vars (removes quotes if they were pasted accidentally)
const clean = (val) => val ? val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim() : undefined;

const supabaseUrl = clean(process.env.SUPABASE_URL);
const supabaseKey = clean(process.env.SUPABASE_KEY);

let supabase;

if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseKey) missing.push('SUPABASE_KEY');

    console.error(`⚠️  WARNING: Supabase image uploads disabled. Missing ${missing.join(' and ')}.`);
    supabase = null;
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}


module.exports = supabase;

