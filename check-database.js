// Test script to check database tables
const { createClient } = require('@supabase/supabase-js');

// Check if running in development
if (typeof window === 'undefined') {
  require('dotenv').config({ path: './.env.local' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking database tables...\n');

  // Check if job_applications table exists
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ job_applications table error:', error.message);
      if (error.code === 'PGRST106') {
        console.log('📝 Table does not exist - need to create it');
      }
    } else {
      console.log('✅ job_applications table exists');
    }
  } catch (err) {
    console.log('❌ Exception checking job_applications:', err.message);
  }

  // Check if general_applications table exists
  try {
    const { data, error } = await supabase
      .from('general_applications')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ general_applications table error:', error.message);
    } else {
      console.log('✅ general_applications table exists');
    }
  } catch (err) {
    console.log('❌ Exception checking general_applications:', err.message);
  }

  // Check if jobs table exists
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ jobs table error:', error.message);
    } else {
      console.log('✅ jobs table exists');
    }
  } catch (err) {
    console.log('❌ Exception checking jobs:', err.message);
  }

  // Check profiles table
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ profiles table error:', error.message);
    } else {
      console.log('✅ profiles table exists');
    }
  } catch (err) {
    console.log('❌ Exception checking profiles:', err.message);
  }
}

checkTables().catch(console.error);
