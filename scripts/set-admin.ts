// TypeScript script to set a user as admin
// Usage: npx ts-node scripts/set-admin.ts <command> <email>

import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setUserAsAdmin(email: string): Promise<void> {
  try {
    console.log(`Setting user ${email} as admin...`);
    
    // Update user role to admin
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully set user as admin:', data[0]);
    } else {
      console.log('❌ No user found with email:', email);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function removeAdminRole(email: string): Promise<void> {
  try {
    console.log(`Removing admin role from user ${email}...`);
    
    // Update user role back to user
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Successfully removed admin role:', data[0]);
    } else {
      console.log('❌ No user found with email:', email);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listAdmins(): Promise<void> {
  try {
    console.log('Listing all admin users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name, role, created_at')
      .eq('role', 'admin');

    if (error) {
      console.error('Error fetching admin users:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('📋 Admin users:');
      data.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.full_name || 'No name'}) - Created: ${new Date(user.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('No admin users found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function listAllUsers(): Promise<void> {
  try {
    console.log('Listing all users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('email, full_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('👥 All users:');
      data.forEach((user, index) => {
        const roleIcon = user.role === 'admin' ? '👑' : '👤';
        console.log(`${index + 1}. ${roleIcon} ${user.email} (${user.full_name || 'No name'}) - Role: ${user.role} - Created: ${new Date(user.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('No users found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

async function main(): Promise<void> {
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
        console.log('Usage: npx ts-node scripts/set-admin.ts set <email>');
        return;
      }
      await setUserAsAdmin(email);
      break;
    
    case 'remove':
      if (!email) {
        console.error('❌ Please provide an email address');
        console.log('Usage: npx ts-node scripts/set-admin.ts remove <email>');
        return;
      }
      await removeAdminRole(email);
      break;
    
    case 'list':
      await listAdmins();
      break;
    
    case 'users':
      await listAllUsers();
      break;
    
    default:
      console.log('🔧 Admin Management Tool');
      console.log('');
      console.log('Usage:');
      console.log('  npx ts-node scripts/set-admin.ts set <email>     - Set user as admin');
      console.log('  npx ts-node scripts/set-admin.ts remove <email> - Remove admin role');
      console.log('  npx ts-node scripts/set-admin.ts list           - List all admin users');
      console.log('  npx ts-node scripts/set-admin.ts users          - List all users');
      console.log('');
      console.log('Examples:');
      console.log('  npx ts-node scripts/set-admin.ts set john@example.com');
      console.log('  npx ts-node scripts/set-admin.ts list');
      break;
  }
}

main().catch(console.error);
