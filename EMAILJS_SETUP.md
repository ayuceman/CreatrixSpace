# EmailJS Setup Guide

This guide will help you set up EmailJS to receive booking confirmation emails in your Gmail account.

## Step 1: Create an EmailJS Account

1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Connect Your Gmail Account

1. Log in to your EmailJS dashboard
2. Go to **Email Services** section
3. Click **Add New Service**
4. Select **Gmail** from the list
5. Follow the prompts to connect your Gmail account
6. Grant EmailJS permission to access your Gmail account
7. Note your **Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. In the EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Use the following template structure:

### Template Variables

The following variables are available in your template:

- `{{to_email}}` - Your admin email address
- `{{to_name}}` - Admin name
- `{{from_name}}` - Sender name
- `{{subject}}` - Email subject
- `{{message}}` - Plain text email content
- `{{html_message}}` - HTML formatted email content
- `{{booking_id}}` - Booking ID
- `{{customer_name}}` - Customer full name
- `{{customer_email}}` - Customer email
- `{{customer_phone}}` - Customer phone
- `{{company}}` - Company name (if provided)
- `{{location_name}}` - Location name
- `{{plan_name}}` - Plan name
- `{{plan_type}}` - Plan type
- `{{start_date}}` - Start date
- `{{end_date}}` - End date
- `{{start_time}}` - Start time
- `{{end_time}}` - End time
- `{{total_amount}}` - Total amount with currency
- `{{status}}` - Booking status
- `{{meeting_room_hours}}` - Meeting room hours
- `{{guest_passes}}` - Guest passes count
- `{{add_ons}}` - Selected add-ons (comma-separated)
- `{{notes}}` - Customer notes

### Recommended Template

**Subject:**
```
{{subject}}
```

**Content (HTML):**
```html
{{html_message}}
```

Or if you prefer plain text:
```
{{message}}
```

4. Save the template and note your **Template ID**

## Step 4: Get Your Public Key

1. In the EmailJS dashboard, go to **Account** → **General**
2. Find your **Public Key** (also called User ID)
3. Copy this key

## Step 5: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
# EmailJS Configuration
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_ADMIN_EMAIL=your_gmail_address@gmail.com
```

Replace:
- `your_public_key_here` with your EmailJS Public Key
- `your_service_id_here` with your Gmail Service ID
- `your_template_id_here` with your Email Template ID
- `your_gmail_address@gmail.com` with your Gmail address where you want to receive booking emails

## Step 6: Restart Your Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Testing

1. Create a test booking through your application
2. Check your Gmail inbox for the booking confirmation email
3. The email should contain all booking details including:
   - Customer information
   - Booking details (location, plan, dates, times)
   - Add-ons and extras
   - Pricing information
   - Notes (if any)

## Troubleshooting

### Email not being sent

1. Check the browser console for any error messages
2. Verify all environment variables are set correctly
3. Make sure your EmailJS service is connected and active
4. Check that your template ID matches the one in your dashboard
5. Verify your Gmail account is properly connected in EmailJS

### Email sent but not received

1. Check your spam/junk folder
2. Verify the `VITE_ADMIN_EMAIL` is set to the correct Gmail address
3. Check EmailJS dashboard for delivery status
4. Make sure your Gmail account has granted permissions to EmailJS

### Environment variables not working

1. Make sure variables start with `VITE_` prefix (required for Vite)
2. Restart your development server after adding/changing variables
3. Check that the `.env` file is in the root directory
4. Verify there are no typos in variable names

## EmailJS Free Tier Limits

- 200 emails per month
- For production use, consider upgrading to a paid plan

## Support

For EmailJS-specific issues, visit:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)

