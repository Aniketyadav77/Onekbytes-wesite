# Admin Management

This document explains how to manage admin users in your application.

## How Admin System Works

The admin system is based on user roles stored in the `profiles` table in your Supabase database. Each user profile has a `role` field that can be either `'user'` (default) or `'admin'`.

### Features:
- **Role-based access control**: Only users with `role: 'admin'` can access admin pages
- **Automatic profile creation**: User profiles are created automatically when users sign up
- **Admin-only navigation**: The admin link in the navbar only appears for admin users
- **Protected admin routes**: Admin pages redirect non-admin users to the home page

## Setting Up Admin Users

### Method 1: Using the Admin Management Script (Recommended)

We've provided TypeScript and JavaScript scripts to help you manage admin users.

#### Prerequisites:
1. Set up your environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ **Important**: You need the service role key (not the anon key) to update user roles.

#### Using the TypeScript script:

```bash
# Set a user as admin
npx ts-node scripts/set-admin.ts set user@example.com

# Remove admin role from a user
npx ts-node scripts/set-admin.ts remove user@example.com

# List all admin users
npx ts-node scripts/set-admin.ts list

# List all users (with role indicators)
npx ts-node scripts/set-admin.ts users
```

#### Using the JavaScript script:

```bash
# Set a user as admin
node scripts/set-admin.js set user@example.com

# Remove admin role from a user
node scripts/set-admin.js remove user@example.com

# List all admin users
node scripts/set-admin.js list
```

### Method 2: Direct Database Update

You can also update user roles directly in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the "Table Editor"
3. Open the `profiles` table
4. Find the user you want to make admin
5. Edit their `role` field from `'user'` to `'admin'`
6. Save the changes

### Method 3: Using SQL

Run this SQL query in your Supabase SQL editor:

```sql
-- Set a user as admin (replace with actual email)
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- Remove admin role
UPDATE profiles 
SET role = 'user' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- List all admin users with their emails
SELECT 
  p.user_id,
  p.full_name,
  p.display_name,
  p.role,
  p.created_at,
  au.email
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.role = 'admin';
```

## Admin Features

Once a user has admin role, they can:

1. **Access the Admin Dashboard**: Navigate to `/admin/jobs` or click the "Admin" link in the navbar
2. **Manage Job Postings**: Create, edit, and delete job postings
3. **View Applications**: See all job applications submitted by users
4. **Manage Applications**: Update application status and review candidates

## Security Notes

- **Service Role Key**: Keep your service role key secure and never expose it in client-side code
- **Environment Variables**: Always use environment variables for sensitive credentials
- **Role Validation**: The system validates admin access on both frontend and backend
- **Automatic Redirects**: Non-admin users are automatically redirected away from admin pages

## Troubleshooting

### Issue: Admin link not showing
- Make sure the user's profile has `role: 'admin'` in the database
- Check that the AuthContext is properly fetching the user profile
- Verify the user is logged in

### Issue: Access denied on admin pages
- Confirm the user's role is set to `'admin'` in the profiles table
- Make sure the profile was fetched successfully (check browser console)
- Try logging out and logging back in to refresh the profile data

### Issue: Script not working
- Verify your environment variables are set correctly
- Make sure you're using the service role key (not the anon key)
- Check that the user exists in the profiles table

## First-Time Setup

When setting up your first admin user:

1. Create a regular account through your app's sign-up process
2. Use one of the methods above to set that user as admin
3. Log out and log back in to see the admin features

## Database Schema

The `profiles` table structure:
```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  company TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**Important Notes:**
- The `user_id` field links to `auth.users(id)` - this is the connection between authentication and profiles
- The `id` field is the profile's own UUID, separate from the auth user ID
- Each auth user can have only one profile (enforced by UNIQUE constraint on user_id)
- Profiles are created automatically when users first sign up
