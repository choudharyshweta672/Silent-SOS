// =============================================
//   silent-sos / public / js / app.js
//   Decoy notes app logic
//   Phase 2: shows GPS status in overlay
// =============================================

// Show today's date in the header
function showDate() {
  const el = document.getElementById("date-display");
  if (!el) return;
  const now    = new Date();
  const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  el.textContent = days[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate();
}

showDate();


// Save note to localStorage
function saveNote() {
  const text = document.getElementById("note-input").value;
  localStorage.setItem("sos-note", text);

  const msg = document.getElementById("saved-msg");
  msg.textContent = "Note saved!";
  setTimeout(function() { msg.textContent = ""; }, 2000);
}


// Load saved note on page open
window.addEventListener("load", function() {
  const saved = localStorage.getItem("sos-note");
  if (saved) {
    document.getElementById("note-input").value = saved;
  }
});


// Update the SOS overlay status message
// Called from trigger.js with GPS result
function updateSOSStatus(hasLocation, lat, lng) {
  const statusEl = document.getElementById("sos-status");
  if (!statusEl) return;

  if (hasLocation) {
    statusEl.textContent = `Alert sent with your location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } else {
    statusEl.textContent = "Alert sent! (location unavailable)";
  }
}


// Dismiss the SOS overlay
function dismissOverlay() {
  const overlay = document.getElementById("sos-overlay");
  if (overlay) overlay.classList.remove("show");
}
