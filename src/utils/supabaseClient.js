/**
 * Supabase Client Utility
 * Configured using environment variables
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
} else {
    console.warn('⚠️ Supabase credentials not configured. Database operations will be skipped.');
}

module.exports = supabase;
