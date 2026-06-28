# 🆘 Silent SOS — Hidden Emergency Trigger System

> A safety-tech web app that lets users secretly trigger an emergency alert without alerting an attacker. Works on both laptop and mobile.

![Phase](https://img.shields.io/badge/Phase-2%20Complete-brightgreen)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20Node.js%20%7C%20Resend-blue)
![Live](https://img.shields.io/badge/Live-Deployed-success)

🔗 **Live Demo:** https://silent-sos-0tfn.onrender.com

---

## The Problem

In dangerous situations — domestic violence, robbery, assault — victims cannot visibly call for help without escalating risk. Existing solutions (calling 112, pressing a visible SOS button) are obvious and can make the situation worse.

**Silent SOS solves this by letting a user trigger help through a hidden gesture that looks completely normal to an attacker.**

---

## What It Does

**On laptop:** Press spacebar 3 times within 2 seconds → SOS fires  
**On mobile:** Tap the top-left corner 3 times fast → SOS fires

When triggered, the system:
- 📍 Grabs live GPS coordinates instantly
- 🗺️ Builds a Google Maps link to your exact location
- 📧 Sends a formatted emergency email to your trusted contact
- 🎭 Shows a decoy notes app — attacker sees nothing suspicious

---

## Demo
User presses spacebar ×3 (laptop) or taps corner ×3 (mobile)

↓

SOS engine detects trigger

↓

GPS coordinates captured

↓

POST /send-sos → Node.js server

↓

Resend API → emergency email fired

↓

"🆘 URGENT: SOS Alert — Please check on me!"

Google Maps link to exact location
 
 ---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML + Vanilla JS | Lightweight, runs on any device |
| Trigger (laptop) | keydown + Date.now() | No library needed |
| Trigger (mobile) | touchstart events | Works on all phones |
| GPS | Geolocation API | Built into every browser |
| Backend | Node.js + Express | Simple REST API |
| Email | Resend API | Works on free hosting, no SMTP blocking |
| Hosting | Render.com | Free HTTPS, auto-deploy from GitHub |

---

## How The Trigger Works

**Laptop — keyboard trigger:**
```javascript
document.addEventListener("keydown", function(e) {
  if (e.key !== " ") return;
  const now = Date.now();
  pressTimes.push(now);
  pressTimes = pressTimes.filter(t => (now - t) < 2000);
  if (pressTimes.length >= 3) sendSOS();
});
```

**Mobile — hidden tap zone:**
```javascript
// Invisible 60x60px div in top-left corner
tapZone.addEventListener("touchstart", function(e) {
  // same timestamp logic as keyboard trigger
  if (tapTimes.length >= 3) sendSOS();
});
```

**GPS + Email:**
```javascript
async function sendSOS() {
  const position = await getLocation();  // GPS coordinates
  const mapsUrl  = `https://maps.google.com/?q=${lat},${lng}`;
  await fetch("/send-sos", {             // call backend
    method: "POST",
    body: JSON.stringify({ message, timestamp, lat, lng, mapsUrl })
  });
}
```

---

## Project Structure
silent-sos/

├── public/

│   ├── index.html         ← decoy notes app UI

│   ├── css/style.css      ← styling

│   └── js/

│       ├── trigger.js     ← hidden SOS trigger (keyboard + mobile)

│       └── app.js         ← decoy app logic

├── server/

│   ├── server.js          ← Express backend

│   └── email.js           ← Resend email helper

├── config/

│   └── .env               ← credentials (never committed)

├── .gitignore

└── package.json

---

## Setup & Run Locally

### Prerequisites
- Node.js v18+
- Free [Resend account](https://resend.com)

### 1. Clone the repo
```bash
git clone https://github.com/choudharyshweta672/Silent-SOS.git
cd Silent-SOS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add credentials
Create `config/.env`:
RESEND_API_KEY=re_xxxxxxxxxxxx

ALERT_EMAIL=your@email.com

PORT=3000

### 4. Run
```bash
npm start
```

Open `http://localhost:3000` → press spacebar 3 times!

---

## Ethical Design Decisions

| Principle | Implementation |
|---|---|
| Consent | User sets up the app and chooses their trusted contact |
| No passive surveillance | GPS only captured on trigger, never passively |
| Data minimisation | No data stored — alert sent and forgotten |
| Open source | Full code visible — no hidden behaviour |

---

## Roadmap

- [x] **Phase 1** — Hidden trigger + SMS alert
- [x] **Phase 2** — Live GPS location + email alert + mobile trigger + deployed live
- [ ] **Phase 3** — Background audio capture + decoy UI upgrade
- [ ] **Phase 4** — Cloud evidence vault + trusted contacts dashboard

---

## What I Learned

- JavaScript event handling (`keydown`, `touchstart`)
- Timestamp-based detection windows using `Date.now()` and `Array.filter()`
- Browser Geolocation API and wrapping callbacks in Promises
- Async API calls with `fetch()` and `async/await`
- Building REST APIs with Node.js and Express
- Third-party API integration (Resend)
- Debugging deployment issues (SMTP blocking, env variables, port binding)
- Git workflow — commits, push, resolving conflicts

---

## Author

**Shweta Choudhary** — B.Tech CSE
- GitHub: [@choudharyshweta672](https://github.com/choudharyshweta672)

---

## License

MIT — free to use, modify, and build on.