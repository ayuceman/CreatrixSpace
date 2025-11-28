# EmailJS Template Setup Guide

This guide will help you set up the beautiful email template in your EmailJS dashboard.

## 📧 Two Template Options

I've created two email templates for you:

1. **`emailjs-template.html`** - Beautiful, modern template with gradients and enhanced styling
2. **`emailjs-template-simple.html`** - Simpler, cleaner template (better email client compatibility)

Choose the one that best fits your needs. The simple template has better compatibility across email clients.

## 🚀 Quick Setup Steps

### Step 1: Copy the Template

1. Open either `emailjs-template.html` or `emailjs-template-simple.html` in a text editor
2. Copy the entire HTML content

### Step 2: Create Template in EmailJS

1. Log in to your [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Go to **Email Templates** → **Create New Template**
3. Give it a name: "Creatrix Space Booking Notification"
4. Paste the HTML content into the template editor

### Step 3: Configure Template Variables

In the EmailJS template editor, you need to set up the following variables. EmailJS uses `{{variable_name}}` syntax.

**Required Variables:**
- `{{booking_id}}` - Booking ID
- `{{customer_name}}` - Customer full name
- `{{customer_email}}` - Customer email
- `{{customer_phone}}` - Customer phone
- `{{location_name}}` - Location name
- `{{plan_name}}` - Plan name
- `{{plan_type}}` - Plan type
- `{{total_amount}}` - Total amount with currency
- `{{status}}` - Booking status
- `{{date}}` - Current date/time

**Optional Variables (will show if provided):**
- `{{company}}` - Company name
- `{{start_date}}` / `{{end_date}}` - Booking dates
- `{{start_time}}` / `{{end_time}}` - Booking times
- `{{room_name}}`, `{{room_status}}`, `{{room_notes}}` - Selected room information
- `{{booking_source}}` - Where the booking originated (admin/manual/online)
- `{{payment_method}}` and `{{payment_status}}`
- `{{add_ons}}` - Selected add-ons
- `{{meeting_room_hours}}` - Meeting room hours
- `{{guest_passes}}` - Guest passes
- `{{notes}}` - Customer notes
- `{{manual_notes}}` - Admin/internal notes

### Step 4: Set Email Subject

In the template settings, set the **Subject** to:
```
New Booking: {{customer_name}} - {{plan_name}} at {{location_name}}
```

Or use a simpler version:
```
New Booking Received - {{booking_id}}
```

### Step 5: Configure "To" Email

1. In the template settings, find the **To Email** field
2. Set it to: `{{to_email}}`
3. This will use the `VITE_ADMIN_EMAIL` from your environment variables

### Step 6: Test the Template

1. Click **Save** in the EmailJS template editor
2. Use the **Test** button to send a test email
3. Fill in sample data for the variables
4. Check your Gmail inbox to see how it looks

## 📋 Template Variables Mapping

The template uses these variables that are automatically sent from your application:

| Template Variable | Source | Description |
|------------------|--------|-------------|
| `{{booking_id}}` | `bookingId` | Unique booking identifier |
| `{{customer_name}}` | `customerName` | Full customer name |
| `{{customer_email}}` | `customerEmail` | Customer email address |
| `{{customer_phone}}` | `customerPhone` | Customer phone number |
| `{{company}}` | `company` | Company name (optional) |
| `{{location_name}}` | `locationName` | Selected location |
| `{{plan_name}}` | `planName` | Selected plan |
| `{{plan_type}}` | `planType` | Plan type (day_pass, hot_desk, etc.) |
| `{{room_name}}` | `roomName` | Selected room name |
| `{{room_status}}` | `roomStatus` | Room availability |
| `{{room_notes}}` | `roomNotes` | Extra room notes/manual comments |
| `{{start_date}}` | `startDate` | Booking start date |
| `{{end_date}}` | `endDate` | Booking end date |
| `{{start_time}}` | `startTime` | Booking start time |
| `{{end_time}}` | `endTime` | Booking end time |
| `{{add_ons}}` | `add_ons` | Comma-separated add-on names |
| `{{meeting_room_hours}}` | `meetingRoomHours` | Number of meeting room hours |
| `{{guest_passes}}` | `guestPasses` | Number of guest passes |
| `{{total_amount}}` | `totalAmount` | Formatted total amount |
| `{{status}}` | `status` | Booking status |
| `{{booking_source}}` | `bookingSource` | Where the booking was created |
| `{{payment_method}}` | `paymentMethod` | Payment method |
| `{{payment_status}}` | `paymentStatus` | Payment status |
| `{{notes}}` | `notes` | Customer notes (optional) |
| `{{manual_notes}}` | `manualNotes` | Admin notes (manual entries) |
| `{{to_email}}` | `VITE_ADMIN_EMAIL` | Your Gmail address |
| `{{date}}` | Auto-generated | Current date/time |

## 🎨 Customizing the Template

### Change Colors

The templates use these main colors:
- **Primary**: `#667eea` (purple/blue gradient)
- **Success**: `#28a745` (green)
- **Warning**: `#ffc107` (yellow)
- **Info**: `#17a2b8` (cyan)
- **Danger**: `#ff6b6b` (red)

To change colors, find and replace the hex codes in the HTML.

### Change Fonts

The templates use system fonts for best compatibility:
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

You can change this to any web-safe font.

### Adjust Layout

The templates are set to a maximum width of 600px (standard for emails). You can adjust this in the table width attribute.

## 🔧 Troubleshooting

### Variables Not Showing

1. Make sure variable names match exactly (case-sensitive)
2. Check that variables are being sent from your application
3. Use the EmailJS test feature to verify variables are populated

### Email Not Rendering Correctly

1. Some email clients (like Outlook) have limited HTML support
2. Use the simple template (`emailjs-template-simple.html`) for better compatibility
3. Test in multiple email clients (Gmail, Outlook, Apple Mail)

### Images Not Showing

The templates don't include images by default. If you want to add a logo:
1. Upload the image to a public URL (or use EmailJS attachments)
2. Add an `<img>` tag in the header section
3. Use absolute URLs (not relative paths)

### Conditional Sections Not Working

The templates use Handlebars-style conditionals (`{{#if}}`). If these don't work:
1. EmailJS may use a different templating engine
2. Check EmailJS documentation for conditional syntax
3. You may need to use `{{#variable}}...{{/variable}}` syntax instead

## 📱 Mobile Responsiveness

Both templates are designed to be responsive:
- They use table-based layouts (best for email)
- Maximum width of 600px
- Padding adjusts on smaller screens
- Text sizes are readable on mobile

## ✅ Final Checklist

Before going live, make sure:

- [ ] Template is saved in EmailJS
- [ ] All variables are mapped correctly
- [ ] Test email was received successfully
- [ ] Email looks good in Gmail (desktop and mobile)
- [ ] All booking details are showing correctly
- [ ] Links (email, phone) are clickable
- [ ] Environment variables are set in your `.env` file
- [ ] `VITE_ADMIN_EMAIL` is set to your Gmail address

## 🎯 Next Steps

1. Copy the template HTML into EmailJS
2. Configure all variables
3. Test with sample data
4. Create a test booking in your app
5. Verify the email is received with all details

## 💡 Pro Tips

1. **Keep it simple**: The simpler template has better email client support
2. **Test thoroughly**: Send test emails to different email providers
3. **Monitor delivery**: Check EmailJS dashboard for delivery status
4. **Update regularly**: Adjust the template as your booking process evolves

## 📞 Support

If you encounter issues:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Verify all environment variables are set
3. Check browser console for errors
4. Test with EmailJS's built-in test feature

---

**Note**: The templates are ready to use. Just copy, paste, and configure in EmailJS!

