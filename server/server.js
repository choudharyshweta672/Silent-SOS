// // =============================================
// //   silent-sos / server / server.js
// //   PHASE 2 — Updated to receive GPS data
// //
// //   What's new:
// //   - Extracts lat, lng, mapsUrl from request
// //   - Passes them to twilio.sendSMS()
// //   - Logs location info in terminal
// // =============================================

// // Load .env credentials first
// require("dotenv").config({ path: "./config/.env" });

// const express = require("express");
// const path    = require("path");
// const twilio  = require("./twilio");

// const app  = express();
// const PORT = process.env.PORT || 3000;


// // ---------- Middleware ----------
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "../public")));


// // =============================================
// //   ROUTE: POST /send-sos
// //   Receives trigger from frontend
// //   Now also receives lat, lng, mapsUrl
// // =============================================
// app.post("/send-sos", async (req, res) => {

//   // Extract everything from the request body
//   // lat, lng, mapsUrl will be null if GPS failed
//   const { message, timestamp, lat, lng, mapsUrl } = req.body;

//   // Log everything in terminal so you can see it
//   console.log("\n[SOS RECEIVED]");
//   console.log("  Time:     ", timestamp);
//   console.log("  Message:  ", message);

//   if (lat && lng) {
//     console.log(`  Location:  ${lat}, ${lng}`);
//     console.log(`  Maps URL:  ${mapsUrl}`);
//   } else {
//     console.log("  Location:  unavailable");
//   }

//   try {
//     // Send SMS with location data
//     const result = await twilio.sendSMS(
//       message,
//       timestamp,
//       lat,       // null if GPS failed — twilio.js handles this
//       lng,
//       mapsUrl
//     );

//     console.log("[SOS] SMS sent! SID:", result.sid);

//     res.json({
//       success:  true,
//       message:  "SOS alert sent!",
//       sid:      result.sid,
//       location: lat ? `${lat}, ${lng}` : "unavailable"
//     });

//   } catch (err) {
//     console.error("[SOS] Failed to send SMS:", err.message);

//     res.status(500).json({
//       success: false,
//       message: "Failed to send alert",
//       error:   err.message
//     });
//   }

// });


// // Catch-all: serve index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });


// // Start server
// app.listen(PORT, () => {
//   console.log(`\n Silent SOS Phase 2 running at http://localhost:${PORT}`);
//   console.log(` GPS location enabled — press spacebar 3x to test.\n`);
// });
// =============================================
//   silent-sos / server / server.js
//   Updated — sends email alert via Gmail
// =============================================

require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const path    = require("path");
const email   = require("./email");    // ← email instead of twilio

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));


// =============================================
//   ROUTE: POST /send-sos
// =============================================
app.post("/send-sos", async (req, res) => {
  const { message, timestamp, lat, lng, mapsUrl } = req.body;

  console.log("\n[SOS RECEIVED]");
  console.log("  Time:     ", timestamp);
  console.log("  Message:  ", message);

  if (lat && lng) {
    console.log(`  Location:  ${lat}, ${lng}`);
    console.log(`  Maps URL:  ${mapsUrl}`);
  } else {
    console.log("  Location:  unavailable");
  }

  try {
    // Send email alert
    const result = await email.sendEmail(
      message, timestamp, lat, lng, mapsUrl
    );

    // console.log("[SOS] Email sent! ID:", result.messageId);
console.log("[SOS] Resend response:", JSON.stringify(result));
    res.json({
      success:  true,
      message:  "SOS email sent!",
      id:       result.messageId,
      location: lat ? `${lat}, ${lng}` : "unavailable"
    });

  } catch (err) {
    console.error("[SOS] Failed to send email:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to send alert",
      error:   err.message
    });
  }
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


app.listen(PORT, () => {
  console.log(`\n Silent SOS running at http://localhost:${PORT}`);
  console.log(` Email alerts enabled via Gmail.\n`);
});