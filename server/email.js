// =============================================
//   silent-sos / server / email.js
//   Nodemailer + Gmail alert
//   Sends SOS email when trigger fires
// =============================================
 
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const alertEmail = process.env.ALERT_EMAIL;
if (!process.env.RESEND_API_KEY || !alertEmail) {
  console.error("[Email] ERROR: Missing RESEND_API_KEY or ALERT_EMAIL!");
  process.exit(1);
}
async function sendEmail(message, timestamp, lat, lng, mapsUrl) {
  const locationPart = lat
    ? `<p>📍 <strong>My location:</strong> <a href="${mapsUrl}">${mapsUrl}</a></p>`
    : `<p>📍 <strong>My location:</strong> unavailable</p>`;
  const htmlBody = `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;border:2px solid #d32f2f;border-radius:12px;overflow:hidden">
      <div style="background:#d32f2f;padding:20px;text-align:center">
        <h1 style="color:white;margin:0">🆘 EMERGENCY SOS</h1>
      </div>
      <div style="padding:24px;background:#fff">
        <div style="background:#fff3f3;border-left:4px solid #d32f2f;padding:14px;border-radius:4px;margin-bottom:16px">
          <p style="margin:0;font-size:18px;font-weight:bold;color:#d32f2f">⚠️ Please check on me immediately!</p>
          <p style="margin:6px 0 0;font-size:14px;color:#555">I may be in danger. Please call me or come to my location right now.</p>
        </div>
        <p style="font-size:15px;color:#333">${message}</p>
        ${locationPart}
        <p style="font-size:13px;color:#666">🕐 Time: ${timestamp}</p>
        <div style="text-align:center;margin-top:20px">
          <a href="${mapsUrl || '#'}" style="background:#d32f2f;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">📍 Open My Location in Maps</a>
        </div>
      </div>
    </div>`;
  const result = await resend.emails.send({
    from:    "Silent SOS <onboarding@resend.dev>",
    to:      alertEmail,
    subject: `🆘 URGENT: SOS Alert — Please check on me! (${timestamp})`,
    html:    htmlBody
  });
  return result;
}
module.exports = { sendEmail };