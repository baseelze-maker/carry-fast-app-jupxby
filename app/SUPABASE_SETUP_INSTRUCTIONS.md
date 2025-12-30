
# Supabase Database Setup Instructions

## ⚠️ IMPORTANT: Database Tables Required

Your Supabase project currently has **NO TABLES** set up. This is why sign-in is failing - the app tries to load user profiles from a non-existent `profiles` table.

## 🔧 Quick Fix Options

### Option 1: Disable Email Confirmation (Recommended for Testing)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Find **Email Confirmation** setting
4. **Disable** "Enable email confirmations"
5. Save changes

This will allow users to sign in immediately after signup without email verification.

### Option 2: Create the Profiles Table (Recommended for Production)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('traveler', 'sender', 'both')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'both')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Option 3: Use the Fallback (Already Implemented)

The app now has a fallback mechanism that creates user profiles from authentication metadata when the profiles table doesn't exist. This means:

- ✅ Sign-in will work even without a profiles table
- ✅ User data is stored in Supabase Auth metadata
- ⚠️ You won't be able to query users or create relationships between users and other data

## 🧪 Testing the Fix

1. **Check Console Logs**: Look for emoji-prefixed logs (🔐, ✅, ❌) that show the authentication flow
2. **Try to Sign Up**: Create a new account
3. **Try to Sign In**: Use the credentials you just created
4. **Check for Errors**: Look for any error messages in the console

## 📊 Expected Console Output (Successful Login)

```
🔐 Login button pressed
📧 Email: user@example.com
⏳ Starting login process...
🔐 Attempting to login user: user@example.com
✅ Login successful for: user@example.com
✅ Session: Valid token received
✅ User ID: abc123...
👤 Loading user profile for: abc123...
⚠️ Error loading user profile from database: relation "public.profiles" does not exist
⚠️ This is likely because the profiles table does not exist yet.
📝 Creating user profile from auth metadata...
✅ User profile created from metadata: user@example.com
✅ Auth state immediately updated after login
✅ Login successful, redirecting to home...
```

## 🔍 Troubleshooting

### Issue: "Invalid login credentials"
- **Cause**: Wrong email or password
- **Solution**: Double-check your credentials or create a new account

### Issue: "Email not confirmed"
- **Cause**: Email confirmation is enabled in Supabase
- **Solution**: Check your email for verification link OR disable email confirmation (see Option 1)

### Issue: "relation 'public.profiles' does not exist"
- **Cause**: Profiles table not created
- **Solution**: The app will use fallback mode, but for full functionality, create the table (see Option 2)

### Issue: App freezes on login
- **Cause**: Network timeout or Supabase connection issue
- **Solution**: Check your internet connection and Supabase project status

## 📝 Additional Tables for Full App Functionality

For the complete Wasel app, you'll also need these tables:

```sql
-- Trips table (for travelers posting trips)
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  from_country TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_country TEXT NOT NULL,
  to_city TEXT NOT NULL,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  available_weight DECIMAL NOT NULL,
  price_per_kg DECIMAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests table (for senders requesting delivery)
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  trip_id UUID REFERENCES trips(id),
  from_country TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_country TEXT NOT NULL,
  to_city TEXT NOT NULL,
  item_description TEXT NOT NULL,
  item_weight DECIMAL NOT NULL,
  preferred_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for chat functionality)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  trip_id UUID REFERENCES trips(id),
  request_id UUID REFERENCES requests(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Next Steps

1. Choose one of the fix options above
2. Test sign-in functionality
3. Check console logs for any remaining issues
4. Create additional tables as needed for full app functionality

## 💡 Need Help?

Check the console logs - they now have detailed emoji-prefixed messages that show exactly what's happening during authentication!
