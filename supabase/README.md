# Supabase Database Setup Guide

This guide will help you set up Supabase for the CreatrixSpace booking system.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `creatrixspace` (or your preferred name)
   - Database Password: Choose a strong password (save it!)
   - Region: Choose the closest region to your users
4. Wait for the project to be provisioned (takes a few minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env` (if you don't have one)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

This will create all the necessary tables:
- `profiles` - User profiles (extends auth.users)
- `locations` - Workspace locations
- `plans` - Subscription plans
- `add_ons` - Additional services
- `bookings` - Booking records
- `payments` - Payment records

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure your authentication settings:
   - **Site URL**: Your application URL (e.g., `http://localhost:5173` for development)
   - **Redirect URLs**: Add your production URL when ready

3. (Optional) Enable additional auth providers:
   - Go to **Authentication** → **Providers**
   - Enable any providers you want (Google, GitHub, etc.)

## Step 6: Set Up Row Level Security (RLS)

The schema already includes RLS policies, but you should verify they're enabled:

1. Go to **Table Editor** in your Supabase dashboard
2. For each table (`profiles`, `locations`, `plans`, `add_ons`, `bookings`, `payments`):
   - Click on the table
   - Go to the "Policies" tab
   - Verify that RLS is enabled (should show "RLS Enabled")

## Step 7: Seed Initial Data (Optional)

You can manually add initial data through the Supabase dashboard:

### Add Locations

Go to **Table Editor** → `locations` and add your locations:

```json
{
  "name": "Dhobighat (WashingTown) Hub",
  "slug": "dhobighat-hub",
  "address": "Dhobighat, Kathmandu",
  "description": "A modern coworking space in the heart of Kathmandu",
  "available": true,
  "amenities": ["Fast Wi-Fi", "24/7 Access", "Coffee & Tea", "Meeting Rooms"],
  "capacity": {
    "hotDesks": 20,
    "dedicatedDesks": 10,
    "privateOffices": 5,
    "meetingRooms": 3
  }
}
```

### Add Plans

Go to **Table Editor** → `plans` and add your plans:

```json
{
  "name": "Explorer",
  "type": "day_pass",
  "description": "Perfect for trying out our space",
  "pricing": {
    "daily": 50000
  },
  "active": true,
  "features": ["Access to hot desks", "Wi-Fi", "Coffee & Tea"]
}
```

### Add Add-ons

Go to **Table Editor** → `add_ons` and add your add-ons:

```json
{
  "name": "Extra Meeting Room Hours",
  "description": "Additional meeting room access beyond your plan",
  "price": 50000,
  "currency": "NPR",
  "type": "meeting_room_hours",
  "active": true
}
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the booking page and verify:
   - Locations load from Supabase
   - Plans load from Supabase
   - Add-ons load from Supabase
   - You can create a booking

3. Test authentication:
   - Go to `/register` and create an account
   - Go to `/login` and sign in
   - Verify you can access the dashboard

## Troubleshooting

### "Missing Supabase environment variables" error

- Make sure your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### RLS Policy Errors

- Make sure Row Level Security is enabled on all tables
- Check that the policies in `schema.sql` were created correctly
- Verify your user is authenticated when trying to access protected data

### Authentication Issues

- Check that your Site URL matches your application URL
- Verify redirect URLs are configured correctly
- Check browser console for specific error messages

### Database Connection Issues

- Verify your Supabase project is active (not paused)
- Check that your API keys are correct
- Ensure your network allows connections to Supabase

## Next Steps

1. **Set up email templates** in Supabase for authentication emails
2. **Configure storage buckets** if you need to store images/files
3. **Set up database backups** in Supabase dashboard
4. **Monitor usage** in the Supabase dashboard
5. **Set up production environment variables** when deploying

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Authentication Guide](https://supabase.com/docs/guides/auth)

## Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review browser console errors
3. Check Supabase status page
4. Review the Supabase documentation

