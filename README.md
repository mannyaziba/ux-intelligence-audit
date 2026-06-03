# ◈ CPSA — UX Intelligence Audit Tool

> Score any developer-built interface across the five CPSA lenses and get a prioritised fix list.
> **Structure replaces guesswork.**

---

## Overview

**CPSA** (Clarity · Predictability · Stability · Actionability) is a placeholder MVP for a developer-focused UX diagnostic engine. It simulates an interface audit tool that scores products across five UX lenses and returns a prioritised fix list.

This is **not a real product yet** — it is a structured placeholder for GitHub + Vercel deployment, designed to be expanded into a full diagnostic system.

---

## The Five CPSA Lenses

| Lens | What It Measures |
|---|---|
| **Structure** | Information architecture, layout hierarchy, navigational logic |
| **Flow** | Task progression, state transitions, depth navigation |
| **Feedback** | System response to input: hover, loading, errors, confirmation |
| **Readability** | Typography hierarchy, contrast, information density, scan-paths |
| **Consistency** | Component coherence, spacing rhythm, design system discipline |

Scores are composited (0–100) into a single **Diagnostic Score**.

---

## Tech Stack

- **HTML** / **CSS** / **Vanilla JS**
- Zero dependencies
- IBM Plex Mono + IBM Plex Sans (Google Fonts)
- Vercel-deployable out of the box

---

## Design System

```
Background:  #070707
Surface:     #101010
Border:      #1E1E1E
Text:        #F5F5F5
Muted:       #8A8A8A
Accent:      #D1FF75
```

Aesthetic: **Linear × Vercel × Raycast** — clinical, structured, signal-over-noise.

---

## Project Structure

```
ux-audit-tool/
├── index.html      — Full page layout (hero, audit, fixes, framework)
├── style.css       — Complete design system + responsive layout
├── main.js         — Audit simulation engine + animations
└── README.md       — This file
```

---

## Deploy to Vercel

### Option 1: Drag & Drop
1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the `ux-audit-tool/` folder into the upload area
3. Deploy → done

### Option 2: CLI
```bash
npm i -g vercel
cd ux-audit-tool
vercel
```

### Option 3: GitHub Integration
1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Framework: **Other** (static HTML)
4. Deploy

---

## Run Locally

```bash
# No build step needed — just open the file
open index.html

# Or use a local server
npx serve .
# or
python3 -m http.server 3000
```

---

## Expanding to a Real Product

The codebase is structured to expand cleanly:

### Phase 1 — Static (current)
- Simulated scores per interface type
- No backend required

### Phase 2 — API Integration
- Replace `AUDIT_PROFILES` in `main.js` with API calls
- Add `/api/audit` endpoint (Node/Python/Go)
- Connect to Playwright or Puppeteer for real URL crawling

### Phase 3 — Full Product
- Auth + user accounts
- Persistent audit history
- Team workspaces
- PDF/CSV report export
- Webhook integration (Slack, Linear, Jira)

---

## Placeholder Data

The audit simulation (`main.js`) contains six pre-built profiles:

- `Dashboard` — default profile (score: 67)
- `SaaS Platform` — score: 74
- `Portfolio` — score: 58 (high risk)
- `Admin Panel` — score: 61
- `Dev Tool` — score: 79 (low risk)
- `API Console` — score: 70

Scores change dynamically based on the **Interface Type** dropdown selection.

---

## License

MIT — use freely, expand freely.

---

*CPSA Placeholder Build · v0.1.0 · Not Production*
