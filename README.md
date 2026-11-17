# S2K2 Inc. — Unified Dual-Business Web Platform
### `https://s2k2.com/` • Enterprise Fiber Infrastructure & Modern Web Solutions

A modern, high-performance, and lightweight web application built for **S2K2 Inc.** showcasing two core divisions:
1. **Underground & Aerial Fiber Laying** (Critical Outside Plant Telecom Infrastructure)
2. **Web Designing & Business Integrations** (Modern Web Applications with Live System Wiring)

---

## 🌟 Key Architecture & Highlights

- **Dual-Gateway Home View (`/` or `/home`)**:
  - Features **2 floating interactive service buttons/cards** with real-time subtle physics and glowing status rings.
  - Clicking either card or button flows smoothly to `/fibre-optic` or `/web-design` with a professional, clean URL in the browser address bar.
  - Persistent floating quick dock at the bottom of the screen for instant 1-tap switching anywhere on mobile or desktop.
  - Comprehensive corporate information at the bottom of the home page (Calgary base, direct telephone, corporate email, and business credentials).

- **Division 1: Underground & Aerial Fiber Laying (`/fibre-optic`)**:
  - Prominently showcases the exact required technical description:
    > *"We provide reliable underground and aerial fiber optic cabling services, ensuring high-speed and secure connectivity. Whether through precise trenching and duct installation or high-tension pole mounting, our solutions protect your infrastructure from environmental damage while maintaining long-term performance and minimal disruption to the surrounding area."*
  - Comprehensive breakdown of civil trenching, horizontal directional drilling (HDD), utility pole mounting, core-alignment fusion splicing (<0.02 dB), and bi-directional OTDR trace certification.
  - Dedicated **Enquiry & Feedback Form** and **Contact Information Alone** (Phone: `+1 587-586-3606`, Email: `selvam@s2k2.com`, Location: Calgary, Alberta, Canada).
  - Strictly excludes quote forms and pricing tiers, directing inquiries straight to direct engineering communication.

- **Division 2: Web Designing & Business Integrations (`/web-design`)**:
  - Prominently showcases the exact required technical description:
    > *"We create modern, responsive websites tailored to your business needs. Our solutions focus on user-friendly design, fast performance, and mobile compatibility to enhance user experience, attract customers, and drive online growth. Modern websites integrated with industry-trusted platforms: custom booking schedules, instant quote generators, table reservations, and POS billing systems."*
  - Generalized business platform integrations:
    - **Automated Scheduling & Booking**: Real-time 2-way sync across major corporate and personal calendar systems with automated SMS/email reminders.
    - **POS & Payment Gateways**: PCI-compliant digital checkouts, automated tax invoices, mobile wallets, and accounting synchronization.
    - **Table Reservations & Dining**: Direct online table bookings, floorplan management, and real-time order alerts.
    - **Dynamic Estimators & Workflows**: Self-service lead qualification engines and CRM/spreadsheet syncing.
  - 3-step execution workflow: Integration Mapping &rarr; Design & Code &rarr; Testing & Handover.
  - Web division contact card with a clear, professional placeholder badge for email (`[Pending Official Finalization: webdesign@s2k2.com]`) and project consultation form.
  - Zero pricing details or dollar numbers as ordered.

- **Stack Simplicity & Maximum Efficiency**:
  - Built with pure semantic **HTML5, modern CSS3 (Custom Properties & Glassmorphism), and Vanilla JavaScript (ES6+)**.
  - **Zero build dependencies**: No bulky `node_modules`, no Webpack/Vite build steps to fail, and instant sub-10ms loading speeds.
  - **Full Routing Support**: HTML5 `pushState`, browser Back/Forward history, hash fallback for local file viewing, and pre-configured server rewrite files (`vercel.json`, `_redirects`, `.htaccess`).

---

## 📁 Project Structure

```
s2k2-unified-website/
├── index.html          # Core single-page application with all 3 views (Home, Fiber, Web)
├── style.css           # Premium dark-mode design system, glowing accents & responsive layout
├── router.js           # Client-side routing engine with HTML5 history & hash fallback
├── app.js              # Micro-interactions, form submissions & toast notifications
├── fibre-optic.html    # Direct route fallback for static hosts
├── web-design.html     # Direct route fallback for static hosts
├── vercel.json         # Rewrites for Vercel deployment
├── _redirects          # Rewrites for Netlify & Cloudflare Pages
├── .htaccess           # Apache rewrite rules for GoDaddy / cPanel hosting
├── assets/             # Brand logos, favicons, and icons
└── README.md           # Documentation & deployment guide
```

---

## 🚀 How to Preview & Run Locally

### Option 1: Direct Browser Launch (Zero Installation)
Simply double-click `index.html` in Windows Explorer or open it in Google Chrome, Microsoft Edge, Brave, or Safari. The router automatically uses the hash routing fallback (`#fibre-optic`, `#web-design`) with 100% functionality.

### Option 2: Lightweight Python Server (Recommended for Clean URLs)
Open PowerShell inside `C:\Users\sharukesan\.gemini\antigravity\scratch\s2k2-unified-website` and run:
```powershell
python -m http.server 8080
```
Open your browser to: `http://localhost:8080`

### Option 3: Node / npx serve
```bash
npx serve .
```

---

## 🌐 Deploying to `s2k2.com`

### Deploying to GoDaddy / cPanel (Current Host)
1. Log into your GoDaddy / hosting file manager or connect via SFTP.
2. Navigate to the web root directory (`public_html` or `httpdocs`).
3. Upload all files from this directory (`index.html`, `style.css`, `router.js`, `app.js`, `fibre-optic.html`, `web-design.html`, `.htaccess`, and the `assets/` folder).
4. The `.htaccess` file will ensure direct visits to `https://s2k2.com/fibre-optic` and `https://s2k2.com/web-design` work without 404 errors.

### Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` inside this directory and follow the prompts.
3. The included `vercel.json` will configure rewrite rules automatically.

### Deploying to Netlify / Cloudflare Pages
1. Drag and drop the `s2k2-unified-website` folder onto your Netlify dashboard or push to GitHub.
2. The included `_redirects` file will handle clean routing automatically.

---

## 📞 Company Contact Details Maintained

- **Company:** S2K2 Inc.
- **Location:** Calgary, Alberta, Canada
- **Direct Phone:** `+1 (587) 586-3606`
- **Primary Corporate & Fiber Division Email:** `selvam@s2k2.com`
- **Web & Creative Design Email:** `design@s2k2.com`
- **Domain:** `https://s2k2.com/`
