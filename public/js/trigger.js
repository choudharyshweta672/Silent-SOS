// =============================================
//   silent-sos / public / js / trigger.js
//   PHASE 2 — Hidden Trigger + GPS Location
//   
//   What's new in Phase 2:
//   - getLocation() fetches GPS coordinates
//   - sendSOS() waits for location before sending
//   - Google Maps link included in the SMS
// =============================================


// ---------- SETTINGS (change freely) ----------
const TRIGGER_KEY    = " ";    // spacebar
const REQUIRED_COUNT = 3;      // presses needed
const TIME_WINDOW_MS = 2000;   // within 2 seconds
const COOLDOWN_MS    = 5000;   // wait before re-trigger
// ----------------------------------------------


// ---------- STATE ----------
let pressTimes = [];
let sosFired   = false;


// =============================================
//   STEP 1 — LISTEN FOR KEYPRESSES
//   (exactly same as Phase 1)
// =============================================
document.addEventListener("keydown", function(e) {

  // Only react to trigger key
  if (e.key !== TRIGGER_KEY) return;

  // Block if already fired
  if (sosFired) return;

  // Record timestamp
  const now = Date.now();
  pressTimes.push(now);

  // Remove old presses outside time window
  pressTimes = pressTimes.filter(function(t) {
    return (now - t) < TIME_WINDOW_MS;
  });

  // Check if enough presses
  if (pressTimes.length >= REQUIRED_COUNT) {
    pressTimes = [];
    sosFired   = true;

    // FIRE!
    sendSOS();

    // Allow re-trigger after cooldown
    setTimeout(function() {
      sosFired = false;
    }, COOLDOWN_MS);
  }

});


// =============================================
//   STEP 2 — GET GPS LOCATION  ← NEW in Phase 2
//   
//   Wraps navigator.geolocation in a Promise
//   so we can use await on it in sendSOS()
// =============================================
function getLocation() {
  return new Promise(function(resolve, reject) {

    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by this browser.");
      return;
    }

    // Ask browser for current position
    navigator.geolocation.getCurrentPosition(
      function(position) {
        resolve(position);   // success → give position to await
      },
      function(error) {
        reject(error);       // failure → throw to catch block
      },
      {
        timeout:            5000,  // give up after 5 seconds
        enableHighAccuracy: true   // use GPS chip not just wifi
      }
    );

  });
}


// =============================================
//   STEP 3 — SEND THE ALERT  ← UPDATED in Phase 2
//
//   Now gets GPS first, then sends SMS with
//   coordinates + Google Maps link
// =============================================
async function sendSOS() {
  console.log("[SOS] Trigger detected! Getting location...");

  // Show overlay so user knows SOS fired
  showSOSOverlay();

  // --- Get GPS coordinates ---
  // These start as null in case GPS fails
  let lat     = null;
  let lng     = null;
  let mapsUrl = null;

  try {
    // Wait for GPS to respond (up to 5 seconds)
    const position = await getLocation();

    lat     = position.coords.latitude;
    lng     = position.coords.longitude;
    mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

    console.log(`[SOS] Location found: ${lat}, ${lng}`);

  } catch (err) {
    // GPS failed — that's OK!
    // SOS will still send, just without location
    console.warn("[SOS] Could not get location:", err.message || err);
  }

  // --- Send SOS to backend ---
  try {
    const response = await fetch("/send-sos", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:   "EMERGENCY: SOS triggered. Please check on me immediately.",
        timestamp: new Date().toLocaleString(),
        lat:       lat,       // null if GPS failed
        lng:       lng,       // null if GPS failed
        mapsUrl:   mapsUrl    // null if GPS failed
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log("[SOS] Alert sent successfully!", result);
    } else {
      console.error("[SOS] Server error:", result);
    }

  } catch (err) {
    console.error("[SOS] Network error — could not send alert:", err);
  }
}


// ---------- Show SOS overlay ----------
function showSOSOverlay() {
  const overlay = document.getElementById("sos-overlay");
  if (overlay) overlay.classList.add("show");
}
// =============================================
//   MOBILE TRIGGER — tap hidden area 3x fast
//   Works on phones where keyboard doesn't fire
// =============================================
(function() {
  // Create invisible tap zone — top left corner
  const tapZone = document.createElement("div");
  tapZone.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    z-index: 9999;
    opacity: 0;
    cursor: default;
  `;
  document.body.appendChild(tapZone);

  let tapTimes = [];

  tapZone.addEventListener("touchstart", function(e) {
    e.preventDefault();
    if (sosFired) return;

    const now = Date.now();
    tapTimes.push(now);
    tapTimes = tapTimes.filter(t => (now - t) < TIME_WINDOW_MS);

    if (tapTimes.length >= REQUIRED_COUNT) {
      tapTimes = [];
      sosFired  = true;
      sendSOS();
      setTimeout(function() { sosFired = false; }, COOLDOWN_MS);
    }
  });
})();