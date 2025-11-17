import emailjs from '@emailjs/browser'

// Initialize EmailJS with public key from environment variables
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

interface BookingEmailData {
  // Customer Info
  customerName: string
  customerEmail: string
  customerPhone: string
  company?: string
  
  // Booking Details
  bookingId: string
  locationName: string
  planName: string
  planType: string
  
  // Dates & Times
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  
  // Add-ons
  selectedAddOns: string[]
  meetingRoomHours: number
  guestPasses: number
  
  // Pricing
  totalAmount: number
  currency: string
  
  // Notes
  notes?: string
  
  // Booking Status
  status: string
}

/**
 * Format booking details into a readable email message
 */
function formatBookingEmail(data: BookingEmailData): string {
  const {
    customerName,
    customerEmail,
    customerPhone,
    company,
    bookingId,
    locationName,
    planName,
    planType,
    startDate,
    endDate,
    startTime,
    endTime,
    selectedAddOns,
    meetingRoomHours,
    guestPasses,
    totalAmount,
    currency,
    notes,
    status,
  } = data

  // Format amount with 2 decimal places
  let amount = typeof totalAmount === 'number' ? totalAmount : parseFloat(String(totalAmount)) || 0
  
  // Convert from paisa to rupees if needed
  // If amount is very large (>= 1000) and divisible by 100, it's likely in paisa
  if (amount >= 1000 && amount % 100 === 0 && amount >= 10000) {
    // Likely in paisa, convert to rupees (divide by 100)
    amount = amount / 100
  }
  
  // Ensure amount is a valid number
  if (isNaN(amount) || !isFinite(amount)) {
    amount = 0
  }
  
  // Format with 2 decimal places and thousand separators
  const formattedAmount = amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: true
  })

  let emailContent = `
═══════════════════════════════════════════════════════════
           NEW BOOKING RECEIVED - CREATRIX SPACE
═══════════════════════════════════════════════════════════

BOOKING ID: ${bookingId}
STATUS: ${status.toUpperCase()}
DATE: ${new Date().toLocaleString()}

───────────────────────────────────────────────────────────
CUSTOMER INFORMATION
───────────────────────────────────────────────────────────
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
${company ? `Company: ${company}` : ''}

───────────────────────────────────────────────────────────
BOOKING DETAILS
───────────────────────────────────────────────────────────
Location: ${locationName}
Plan: ${planName} (${planType})
${startDate ? `Start Date: ${new Date(startDate).toLocaleDateString()}` : ''}
${endDate && endDate !== startDate ? `End Date: ${new Date(endDate).toLocaleDateString()}` : ''}
${startTime ? `Start Time: ${startTime}` : ''}
${endTime ? `End Time: ${endTime}` : ''}

───────────────────────────────────────────────────────────
ADD-ONS & EXTRAS
───────────────────────────────────────────────────────────
${selectedAddOns.length > 0 
  ? `Selected Add-ons:\n${selectedAddOns.map(addon => `  • ${addon}`).join('\n')}`
  : 'No add-ons selected'
}
${meetingRoomHours > 0 ? `Meeting Room Hours: ${meetingRoomHours} ${meetingRoomHours === 1 ? 'hour' : 'hours'}` : ''}
${guestPasses > 0 ? `Guest Passes: ${guestPasses} ${guestPasses === 1 ? 'pass' : 'passes'}` : ''}
${!selectedAddOns.length && meetingRoomHours === 0 && guestPasses === 0 ? 'No add-ons or extras selected' : ''}

───────────────────────────────────────────────────────────
PRICING
───────────────────────────────────────────────────────────
Total Amount: ${currency} ${formattedAmount}
Payment Status: Pending

───────────────────────────────────────────────────────────
${notes ? `NOTES\n───────────────────────────────────────────────────────────\n${notes}\n\n` : ''}
═══════════════════════════════════════════════════════════
This is an automated email from Creatrix Space booking system.
═══════════════════════════════════════════════════════════
`

  return emailContent
}

/**
 * Format booking details into HTML email
 */
function formatBookingEmailHTML(data: BookingEmailData): string {
  const {
    customerName,
    customerEmail,
    customerPhone,
    company,
    bookingId,
    locationName,
    planName,
    planType,
    startDate,
    endDate,
    startTime,
    endTime,
    selectedAddOns,
    meetingRoomHours,
    guestPasses,
    totalAmount,
    currency,
    notes,
    status,
  } = data

  // Format amount with 2 decimal places
  let amount = typeof totalAmount === 'number' ? totalAmount : parseFloat(String(totalAmount)) || 0
  
  // Convert from paisa to rupees if needed
  // If amount is very large (>= 1000) and divisible by 100, it's likely in paisa
  if (amount >= 1000 && amount % 100 === 0 && amount >= 10000) {
    // Likely in paisa, convert to rupees (divide by 100)
    amount = amount / 100
  }
  
  // Ensure amount is a valid number
  if (isNaN(amount) || !isFinite(amount)) {
    amount = 0
  }
  
  // Format with 2 decimal places and thousand separators
  const formattedAmount = amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2,
    useGrouping: true
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
    .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
    .info-row { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .badge { display: inline-block; padding: 4px 8px; background: #667eea; color: white; border-radius: 4px; font-size: 12px; margin: 2px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Booking Received</h1>
      <p>Creatrix Space Booking System</p>
    </div>
    
    <div class="content">
      <div class="highlight">
        <strong>Booking ID:</strong> ${bookingId}<br>
        <strong>Status:</strong> ${status.toUpperCase()}<br>
        <strong>Date:</strong> ${new Date().toLocaleString()}
      </div>

      <div class="section">
        <div class="section-title">👤 Customer Information</div>
        <div class="info-row"><span class="label">Name:</span> <span class="value">${customerName}</span></div>
        <div class="info-row"><span class="label">Email:</span> <span class="value">${customerEmail}</span></div>
        <div class="info-row"><span class="label">Phone:</span> <span class="value">${customerPhone}</span></div>
        ${company ? `<div class="info-row"><span class="label">Company:</span> <span class="value">${company}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">📋 Booking Details</div>
        <div class="info-row"><span class="label">Location:</span> <span class="value">${locationName}</span></div>
        <div class="info-row"><span class="label">Plan:</span> <span class="value">${planName} (${planType})</span></div>
        ${startDate ? `<div class="info-row"><span class="label">Start Date:</span> <span class="value">${new Date(startDate).toLocaleDateString()}</span></div>` : ''}
        ${endDate && endDate !== startDate ? `<div class="info-row"><span class="label">End Date:</span> <span class="value">${new Date(endDate).toLocaleDateString()}</span></div>` : ''}
        ${startTime ? `<div class="info-row"><span class="label">Start Time:</span> <span class="value">${startTime}</span></div>` : ''}
        ${endTime ? `<div class="info-row"><span class="label">End Time:</span> <span class="value">${endTime}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">✨ Add-ons & Extras</div>
        ${selectedAddOns.length > 0 
          ? `<div class="info-row">${selectedAddOns.map(addon => `<span class="badge">${addon}</span>`).join(' ')}</div>`
          : '<div class="info-row">No add-ons selected</div>'
        }
        ${meetingRoomHours > 0 ? `<div class="info-row"><span class="label">Meeting Room Hours:</span> <span class="value">${meetingRoomHours} ${meetingRoomHours === 1 ? 'hour' : 'hours'}</span></div>` : ''}
        ${guestPasses > 0 ? `<div class="info-row"><span class="label">Guest Passes:</span> <span class="value">${guestPasses} ${guestPasses === 1 ? 'pass' : 'passes'}</span></div>` : ''}
        ${!selectedAddOns.length && meetingRoomHours === 0 && guestPasses === 0 ? '<div class="info-row">No add-ons or extras selected</div>' : ''}
      </div>

      <div class="section">
        <div class="section-title">💰 Pricing</div>
        <div class="info-row"><span class="label">Total Amount:</span> <span class="value" style="font-size: 18px; color: #667eea; font-weight: bold;">${currency} ${formattedAmount}</span></div>
        <div class="info-row"><span class="label">Payment Status:</span> <span class="value">Pending</span></div>
      </div>

      ${notes ? `
      <div class="section">
        <div class="section-title">📝 Notes</div>
        <div class="info-row">${notes}</div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>This is an automated email from Creatrix Space booking system.</p>
      <p>Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`
}

/**
 * Send booking confirmation email to admin
 */
export async function sendBookingEmail(data: BookingEmailData): Promise<void> {
  // Check if EmailJS is configured
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn('EmailJS is not configured. Skipping email send.')
    console.warn('Please set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID in your .env file')
    return
  }

  if (!ADMIN_EMAIL) {
    console.warn('Admin email is not configured. Skipping email send.')
    console.warn('Please set VITE_ADMIN_EMAIL in your .env file')
    return
  }

  try {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY)

    // Format total amount with 2 decimal places
    // Ensure it's a number and format correctly
    let amount = typeof data.totalAmount === 'number' ? data.totalAmount : parseFloat(String(data.totalAmount)) || 0
    
    // Convert from paisa to rupees if needed
    // If amount is >= 10000, it's likely in paisa (smallest currency unit)
    // Example: 400000 paisa = 4000 rupees, 5000000 paisa = 50000 rupees
    // We divide by 100 to convert paisa to rupees
    if (amount >= 10000) {
      // Very likely in paisa, convert to rupees (divide by 100)
      const originalAmount = amount
      amount = amount / 100
      console.log('EmailJS: Converted from paisa to rupees:', originalAmount, '->', amount)
    } else if (amount >= 1000 && amount % 100 === 0) {
      // Might be in paisa if it's a round number divisible by 100
      const originalAmount = amount
      amount = amount / 100
      console.log('EmailJS: Converted from paisa to rupees (round number):', originalAmount, '->', amount)
    }
    
    // Ensure amount is a valid number
    if (isNaN(amount) || !isFinite(amount)) {
      amount = 0
    }
    
    // Format with 2 decimal places and thousand separators
    const formattedAmount = amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
      useGrouping: true
    })
    
    // Debug logging
    console.log('EmailJS Formatting - Original:', data.totalAmount, 'Final:', amount, 'Formatted:', formattedAmount)

    // Prepare email template parameters
    const templateParams = {
      to_email: ADMIN_EMAIL,
      to_name: 'Creatrix Space Admin',
      from_name: 'Creatrix Space Booking System',
      subject: `New Booking: ${data.customerName} - ${data.planName} at ${data.locationName}`,
      message: formatBookingEmail(data),
      html_message: formatBookingEmailHTML(data),
      // Individual fields for template customization
      booking_id: data.bookingId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      company: data.company || 'N/A',
      location_name: data.locationName,
      plan_name: data.planName,
      plan_type: data.planType,
      start_date: data.startDate ? new Date(data.startDate).toLocaleDateString() : 'N/A',
      end_date: data.endDate ? new Date(data.endDate).toLocaleDateString() : 'N/A',
      start_time: data.startTime || 'N/A',
      end_time: data.endTime || 'N/A',
      total_amount: `${data.currency} ${formattedAmount}`,
      status: data.status.toUpperCase(),
      meeting_room_hours: data.meetingRoomHours > 0 ? `${data.meetingRoomHours} ${data.meetingRoomHours === 1 ? 'hour' : 'hours'}` : 'None',
      guest_passes: data.guestPasses > 0 ? `${data.guestPasses} ${data.guestPasses === 1 ? 'pass' : 'passes'}` : 'None',
      add_ons: data.selectedAddOns.length > 0 ? data.selectedAddOns.join(', ') : 'None',
      notes: data.notes || 'No notes provided',
      date: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    }

    // Send email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Booking email sent successfully:', response.text)
  } catch (error) {
    // Log error but don't throw - we don't want email failures to break the booking process
    console.error('Failed to send booking email:', error)
    // You might want to log this to an error tracking service
  }
}

