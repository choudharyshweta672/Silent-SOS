// =============================================
//   silent-sos / server / twilio.js
//   PHASE 2 — Updated SMS with GPS location
//
//   What's new:
//   - sendSMS() now accepts lat, lng, mapsUrl
//   - SMS includes Google Maps link if available
//   - Falls back gracefully if no location
// =============================================

const twilio = require("twilio");

// Load credentials from .env
const accountSid       = process.env.TWILIO_ACCOUNT_SID;
const authToken        = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone      = process.env.TWILIO_PHONE;
const emergencyContact = process.env.EMERGENCY_CONTACT;

// Validate credentials exist
if (!accountSid || !authToken || !twilioPhone || !emergencyContact) {
  console.error("[Twilio] ERROR: Missing credentials in .env file!");
  console.error("  Make sure config/.env has all 4 values set.");
  process.exit(1);
}

// Create authenticated Twilio client
const client = twilio(accountSid, authToken);


// =============================================
//   sendSMS(message, timestamp, lat, lng, mapsUrl)
//   
//   lat, lng, mapsUrl can be null if GPS failed
//   SMS still sends — just says "location unavailable"
// =============================================
async function sendSMS(message, timestamp, lat, lng, mapsUrl) {

  // Build the location section of the SMS
  // If GPS worked → show coordinates + Maps link
  // If GPS failed → say location unavailable
  const locationPart = lat
    ? `📍 My location:\n${mapsUrl}\n(${lat.toFixed(5)}, ${lng.toFixed(5)})\n\n`
    : `📍 Location: unavailable\n\n`;

  // Build the full SMS message
  const fullMessage =
    `🆘 SILENT SOS ALERT\n` +
    `──────────────────\n` +
    `${message}\n\n` +
    locationPart +
    `🕐 Time: ${timestamp || new Date().toLocaleString()}\n` +
    `──────────────────\n` +
    `Sent by Silent SOS app.`;

  // Send via Twilio
  const result = await client.messages.create({
    body: fullMessage,
    from: twilioPhone,
    to:   emergencyContact
  });

  return result;
}


// Export so server.js can use it
module.exports = { sendSMS };
