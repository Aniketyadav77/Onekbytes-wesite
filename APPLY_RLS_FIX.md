# Quick Fix Guide - Apply RLS Policies

## Problem
Admins getting 400 errors when trying to fetch application counts.

## Solution
Run the SQL fix to update RLS policies.

## Steps

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `fix-job-applications-rls.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`
6. Verify success message appears

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push --file fix-job-applications-rls.sql
```

### Option 3: psql (Direct Database Access)

```bash
psql YOUR_DATABASE_URL < fix-job-applications-rls.sql
```

## Verification

After applying the fix, verify it worked:

1. **Check Policies in Dashboard**:
   - Go to **Authentication** → **Policies**
   - Find `job_applications` table
   - Should see 4 policies:
     - ✅ "Users can view their own job applications"
     - ✅ "Users can create job applications"
     - ✅ "Admins can view all job applications"
     - ✅ "Admins can manage job applications"

2. **Test in Application**:
   - Log in as admin
   - Go to admin jobs page
   - Application counts should load without errors
   - Create a new job - should work smoothly
   - Check browser console - no 400 errors

## What This Fix Does

- ✅ Allows admins to SELECT (read) all job applications
- ✅ Allows admins to COUNT job applications (fixes 400 errors)
- ✅ Allows admins to UPDATE/DELETE job applications
- ✅ Keeps user data secure (users only see their own applications)
- ✅ Maintains proper access control

## Troubleshooting

### Still seeing 400 errors?

1. **Check if you're logged in as admin**:
   ```sql
   SELECT role FROM profiles WHERE user_id = auth.uid();
   ```
   Should return `'admin'`

2. **Verify policies are active**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'job_applications';
   ```

3. **Check RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'job_applications';
   ```
   `rowsecurity` should be `true`

### Table doesn't exist?

If `job_applications` table doesn't exist, run:
```bash
# Apply complete database setup
psql YOUR_DATABASE_URL < complete-database-setup.sql
```

## Need Help?

Check the full documentation in `JOB_CREATION_FIX.md` for detailed explanations of all changes.
