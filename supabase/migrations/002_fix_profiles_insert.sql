-- Fix: Add INSERT policy for profiles table
-- The trigger handle_new_user runs with SECURITY DEFINER so it should work,
-- but we also need to allow the service role to insert

-- Allow service role (trigger) to insert profiles
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Also allow users to insert their own profile (backup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
