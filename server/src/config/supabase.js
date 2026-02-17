const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Helper to clean env vars (removes quotes if they were pasted accidentally)
const clean = (val) => val ? val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1').trim() : undefined;

const supabaseUrl = clean(process.env.SUPABASE_URL);
const supabaseKey = clean(process.env.SUPABASE_KEY);

if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseKey) missing.push('SUPABASE_KEY');

    const errorMsg = `❌ SUPABASE CONFIG ERROR: Missing ${missing.join(' and ')} in environment variables.`;
    console.error(errorMsg);

    // Throw a more helpful error during startup
    if (process.env.NODE_ENV === 'production') {
        throw new Error(errorMsg);
    }
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

