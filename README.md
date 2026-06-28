# 🆘 Silent SOS — Hidden Emergency Trigger System

> A safety-tech web app that lets users secretly trigger an emergency SMS alert without alerting an attacker. Built with vanilla JavaScript + Node.js + Twilio.

![Phase](https://img.shields.io/badge/Phase-1%20Complete-brightgreen)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20Node.js%20%7C%20Twilio-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## The Problem

In dangerous situations — domestic violence, robbery, assault — victims cannot visibly call for help without escalating risk. Existing solutions (calling 112, pressing a visible SOS button) are obvious and can make the situation worse.

**Silent SOS solves this by letting a user trigger help through a hidden gesture that looks completely normal to an attacker.**

---

## Phase 1 — What It Does

Press a secret key combination **3 times within 2 seconds** → an emergency SMS fires automatically to a trusted contact with a distress message.

- No visible button to press
- No screen change that alerts an attacker
- Fires silently in the background
- Works on any browser (mobile + desktop)

---

## Demo

```
User presses: [Space] [Space] [Space]  ← within 2 seconds
                        ↓
         SOS engine detects trigger
                        ↓
         POST /send-sos → Node.js server
                        ↓
         Twilio API → SMS fired to trusted contact
                        ↓
  "EMERGENCY: SOS triggered. Check on me immediately."
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML + Vanilla JS | Lightweight, runs on any device |
| Trigger logic | JavaScript (addEventListener + Date.now) | No library needed |
| Backend | Node.js + Express | Simple REST API |
| SMS | Twilio API | Reliable, free trial available |

---

## How It Works — The Trigger Logic

The secret trigger uses three core JavaScript concepts working together:

**1. addEventListener** — watches for keypresses silently in the background
```js
document.addEventListener("keydown", function(e) { ... });
```

**2. Timestamp array + filter** — checks if 3 presses happened within 2 seconds
```js
pressTimes = pressTimes.filter(t => now - t < 2000);
```

**3. fetch()** — calls the backend endpoint which fires the Twilio SMS
```js
await fetch("/send-sos", { method: "POST", body: JSON.stringify({ message: "SOS!" }) });
```

Full trigger code:
```javascript
let pressTimes = [];

document.addEventListener("keydown", function(e) {
  if (e.key !== " ") return; // spacebar only

  const now = Date.now();
  pressTimes.push(now);
  pressTimes = pressTimes.filter(t => now - t < 2000);

  if (pressTimes.length >= 3) {
    pressTimes = [];
    sendSOS();
  }
});

async function sendSOS() {
  try {
    await fetch("/send-sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "SOS triggered! Check on me immediately." })
    });
    console.log("SOS sent.");
  } catch (err) {
    console.error("Failed to send SOS:", err);
  }
}
```

---

## Project Structure

```
silent-sos/
├── index.html          ← Frontend UI (decoy screen in Phase 3)
├── trigger.js          ← Hidden trigger logic
├── server.js           ← Node.js + Express backend
├── .env                ← Twilio credentials (never committed)
├── .gitignore
└── README.md
```

---

## Setup & Run Locally

### Prerequisites
- Node.js v18+
- A free [Twilio account](https://www.twilio.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/silent-sos.git
cd silent-sos
```

### 2. Install dependencies
```bash
npm install express twilio dotenv
```

### 3. Add your credentials
Create a `.env` file:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1XXXXXXXXXX
EMERGENCY_CONTACT=+91XXXXXXXXXX
```

### 4. Run the server
```bash
node server.js
```

### 5. Open the app
Go to `http://localhost:3000` and press **spacebar 3 times within 2 seconds**.

---

## Ethical & Legal Design Decisions

This project was built with responsible design as a core requirement:

| Principle | Implementation |
|---|---|
| Consent | User sets up the app themselves and chooses their trusted contact |
| No passive surveillance | Audio/video only captured on trigger (Phase 3), never passively |
| Data minimisation | Phase 1 sends only a text message, no personal data stored |
| Transparency | Full source code open — no hidden behaviour |

> These decisions are documented because safety-tech must be ethical by design, not as an afterthought.

---

## Roadmap

- [x] **Phase 1** — Secret trigger + SMS alert (complete)
- [ ] **Phase 2** — Live GPS location sent with alert
- [ ] **Phase 3** — Background audio capture + decoy UI
- [ ] **Phase 4** — Cloud evidence vault + trusted contacts dashboard

---

## What I Learned Building This

- JavaScript event handling (`addEventListener`, `keydown` events)
- Timestamp-based detection windows using `Date.now()` and `Array.filter()`
- Async API calls with `fetch()` and `async/await`
- Building a REST API with Node.js and Express
- Third-party API integration (Twilio)
- Thinking about edge cases: what if the trigger misfires? What if the network is down?

---

## Author

**Your Name** — B.Tech CSE, [Your College]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## License

MIT — free to use, modify, and build on.
