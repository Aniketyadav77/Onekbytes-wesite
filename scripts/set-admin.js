// Script to set a user as admin
// Usage: node scripts/set-admin.js <email>

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setUserAsAdmin(email) {
  try {
    console.log(`Setting user ${email} as admin...`);
    
    // First, find the user by email from auth.users to get their ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    const authUser = authUsers.users.find(user => user.email === email);
    if (!authUser) {
      console.log('❌ No auth user found with email:', email);
      return;
    }

    console.log('Found auth user:', authUser.id, authUser.email);

    // Update user role to admin in profiles table using user_id
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('user_id', authUser.id) // Use user_id, not id
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully set user as admin:', data[0]);
    } else {
      console.log('❌ No profile found for user. Profile may not exist yet.');
      console.log('💡 User may need to sign in first to create their profile.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function removeAdminRole(email) {
  try {
    console.log(`Removing admin role from user ${email}...`);
    
    // First, find the user by email from auth.users to get their ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    const authUser = authUsers.users.find(user => user.email === email);
    if (!authUser) {
      console.log('❌ No auth user found with email:', email);
      return;
    }

    // Update user role back to user
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('user_id', authUser.id) // Use user_id, not id
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully removed admin role:', data[0]);
    } else {
      console.log('❌ No profile found for user.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listAdmins() {
  try {
    console.log('Listing all admin users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name, full_name, role, created_at')
      .eq('role', 'admin');

    if (error) {
      console.error('Error fetching admin users:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('📋 Admin users:');
      
      // Get auth user details for each admin profile
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Fallback to showing profile data only
        data.forEach((profile, index) => {
          console.log(`${index + 1}. User ID: ${profile.user_id} (${profile.full_name || profile.display_name || 'No name'}) - Created: ${new Date(profile.created_at).toLocaleDateString()}`);
        });
        return;
      }

      data.forEach((profile, index) => {
        const authUser = authUsers.users.find(user => user.id === profile.user_id);
        const email = authUser?.email || 'Email not found';
        const name = profile.full_name || profile.display_name || 'No name';
        console.log(`${index + 1}. ${email} (${name}) - Created: ${new Date(profile.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('No admin users found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

async function main() {
  if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
    console.error('❌ Please set NEXT_PUBLIC_SUPABASE_URL environment variable');
    return;
  }

  if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
    console.error('❌ Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
    return;
  }

  switch (command) {
    case 'set':
      if (!email) {
        console.error('❌ Please provide an email address');
        console.log('Usage: node scripts/set-admin.js set <email>');
        return;
      }
      await setUserAsAdmin(email);
      break;
    
    case 'remove':
      if (!email) {
        console.error('❌ Please provide an email address');
        console.log('Usage: node scripts/set-admin.js remove <email>');
        return;
      }
      await removeAdminRole(email);
      break;
    
    case 'list':
      await listAdmins();
      break;
    
    default:
      console.log('Usage:');
      console.log('  node scripts/set-admin.js set <email>     - Set user as admin');
      console.log('  node scripts/set-admin.js remove <email> - Remove admin role');
      console.log('  node scripts/set-admin.js list           - List all admin users');
      break;
  }
}

main();
