# Quick Fix Guide for Job Application Errors

## Immediate Steps to Fix the Issues:

### 1. Fix Storage RLS Policies in Supabase

Go to your Supabase dashboard → SQL Editor and run this SQL:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;

-- Create INSERT policy that handles both path structures
CREATE POLICY "Users can upload their own resumes" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'resumes' 
  AND (
    -- For general applications: general/{userId}/{filename}
    ((storage.foldername(name))[1] = 'general' AND (auth.uid())::text = (storage.foldername(name))[2])
    OR
    -- For job applications: job/{userId}/{filename}
    ((storage.foldername(name))[1] = 'job' AND (auth.uid())::text = (storage.foldername(name))[2])
  )
);

-- Create SELECT policy that handles both path structures
CREATE POLICY "Users can view their own resumes" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'resumes' 
  AND (
    -- For general applications: general/{userId}/{filename}
    ((storage.foldername(name))[1] = 'general' AND (auth.uid())::text = (storage.foldername(name))[2])
    OR
    -- For job applications: job/{userId}/{filename}
    ((storage.foldername(name))[1] = 'job' AND (auth.uid())::text = (storage.foldername(name))[2])
  )
);
```

### 2. Test the Application

After running the SQL:
1. Refresh your browser (localhost:3002/careers)
2. Make sure you're signed in
3. Try applying for a job again
4. Check the browser console for the debug logs

### 3. Debug Information

The updated code now includes:
- ✅ Better error logging
- ✅ User authentication checks
- ✅ File path logging
- ✅ Consistent path structure for both job and general applications

### 4. What Changed

**File Path Structure:**
- General Applications: `general/{userId}/{timestamp}.ext`
- Job Applications: `job/{userId}/{jobId}-{timestamp}.ext`

**RLS Policies:**
- Now handle both path structures
- User ID is consistently at index [2] in both cases

### 5. Expected Results

After fixing:
- ✅ No more "row-level security policy" errors
- ✅ File uploads work for both application types
- ✅ Better error messages if issues occur
- ✅ Console logs for debugging

## If You Still See Errors:

1. **Check Authentication:**
   - Make sure you're signed in
   - Check console for "User:" log to verify user object

2. **Check File Upload:**
   - Look for "Uploading file with path:" in console
   - Verify the path structure matches the RLS policies

3. **Check Supabase:**
   - Verify the SQL ran successfully
   - Check if policies exist in Supabase dashboard

Run this and let me know if you see any other errors!
