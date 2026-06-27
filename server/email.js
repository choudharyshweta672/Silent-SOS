// =============================================
//   silent-sos / server / email.js
//   Nodemailer + Gmail alert
//   Sends SOS email when trigger fires
// =============================================
 
const nodemailer = require("nodemailer");
 
// Load from .env
const gmailUser  = process.env.GMAIL_USER;
const gmailPass  = process.env.GMAIL_PASS;
const alertEmail = process.env.ALERT_EMAIL;
 
// Validate credentials
if (!gmailUser || !gmailPass || !alertEmail) {
  console.error("[Email] ERROR: Missing GMAIL_USER, GMAIL_PASS or ALERT_EMAIL in .env!");
  process.exit(1);
}
 
// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass    // App Password from Google account
  }
});
 
 
// =============================================
//   sendEmail(message, timestamp, lat, lng, mapsUrl)
//   Sends a formatted SOS email
// =============================================
async function sendEmail(message, timestamp, lat, lng, mapsUrl) {
 
  // Build location section
  const locationPart = lat
    ? `<p>📍 <strong>Location:</strong> <a href="${mapsUrl}">${mapsUrl}</a><br/>(${lat.toFixed(5)}, ${lng.toFixed(5)})</p>`
    : `<p>📍 <strong>Location:</strong> unavailable</p>`;
 
  // HTML email body — looks great on phone
  const htmlBody = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;border:2px solid #d32f2f;border-radius:12px;overflow:hidden">
      <div style="background:#d32f2f;padding:20px;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">🆘 SILENT SOS ALERT</h1>
      </div>
      <div style="padding:20px;background:#fff">
        <p style="font-size:16px;color:#333">${message}</p>
        ${locationPart}
        <p>🕐 <strong>Time:</strong> ${timestamp}</p>
        <hr style="border:0.5px solid #eee"/>
        <p style="font-size:12px;color:#999">Sent by Silent SOS app.</p>
      </div>
    </div>
  `;
 
  // Plain text fallback
  const textBody =
    `🆘 SILENT SOS ALERT\n` +
    `──────────────────\n` +
    `${message}\n\n` +
    (lat ? `📍 Location: ${mapsUrl}\n` : `📍 Location: unavailable\n`) +
    `🕐 Time: ${timestamp}\n`;
 
  // Send the email
  const result = await transporter.sendMail({
    from:    `"Silent SOS" <${gmailUser}>`,
    to:      alertEmail,
    subject: `🆘 SOS ALERT — ${timestamp}`,
    text:    textBody,
    html:    htmlBody
  });
 
  return result;
}
 
 
module.exports = { sendEmail };
 