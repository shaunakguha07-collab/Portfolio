# 🚀 SHAUNAK: Portfolio v2.0 (Cyber-Security Edition)

Welcome to the **v2.0 Neural Interface** for my professional portfolio. This project features a high-performance frontend integrated with a secure Node.js backend and a cloud-hosted PostgreSQL database.

---

## 🔗 Live Transmissions
- **Live Portfolio**: [portfolio-backend-4cht.onrender.com](https://portfolio-backend-4cht.onrender.com/)
- **Admin Command Center**: [/admin.html](https://portfolio-backend-4cht.onrender.com/admin.html)
- **Source Code**: [GitHub Repository](https://github.com/shaunakguha07-collab/Portfolio)

---

## 🛠️ Tech Stack & Infrastructure
- **Frontend**: HTML5, CSS3 (Vanilla + Custom Animations), GSAP for motion design.
- **Backend**: Node.js, Express, JWT (JSON Web Tokens) for secure session handling.
- **Database**: PostgreSQL (Managed via [Supabase](https://supabase.com/dashboard/project/ztnhwloqkewthaudphfr)).
- **Testing**: Jest & Supertest (API Integration Testing).
- **CI/CD**: [GitHub Actions](.github/workflows/ci.yml) & [Render.com](https://dashboard.render.com/web/srv-d70413p4tr6s73dvaob0).

---

## 🛰️ v2.0 System Upgrades
### 1. Database Evolution (SQLite → PostgreSQL)
The system has been fully migrated from local SQLite files to a robust, cloud-hosted **PostgreSQL** instance on Supabase. This ensures:
- **Zero Data Loss**: Messages are stored permanently and don't reset when the server restarts.
- **High Availability**: Secure connections via the Supabase Connection Pooler (Port 6543).

### 2. Premium Admin "Black Theme"
The Admin Dashboard has been overhauled with a professional, minimal **Pure Black** aesthetic:
- **HUD Status**: Features a real-time status indicator (`SYSTEM_ONLINE` → `SECURE_SESSION`).
- **Cyber Design**: Corner-bracket HUD elements and glassmorphic panels for a high-end security feel.
- **Fully Responsive**: Redesigned for mobile so you can manage your "Mission Log" (messages) on the go.

### 3. Mobile UI Fixes
Refined the main portfolio's contact section, removing extreme margins and optimizing padding for a pixel-perfect mobile experience.

---

## 🛡️ Security & Environment
To run this system, the following **Environment Variables** are required in your deployment:

| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | Your Supabase connection string (Port 6543). |
| `ADMIN_PASSWORD` | Secret override for admin access. |
| `JWT_SECRET` | Encryption key for secure session tokens. |

---

## 🧪 Testing & CI/CD
The system includes a robust testing suite to ensure API reliability:
- **Framework**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest).
- **Coverage**: Tests for message submission and admin authentication.
- **Mocking**: Database interactions are mocked for isolated, fast execution.
- **Automation**: GitHub Actions automatically runs the test suite on every `push` or `pull_request` to the `main` branch.

To run tests locally:
1.  Navigate to the server directory: `cd server`
2.  Execute the test command: `npm test`

---

## 💻 Local Development
1.  **Clone the terminal**: `git clone https://github.com/shaunakguha07-collab/Portfolio.git`
2.  **Initialize Server**: `cd server && npm install`
3.  **Boot System**: `npm start`
4.  **Access Data**: Open `localhost:3000/admin.html`

---
*Maintained by [Shaunak](https://github.com/shaunakguha07-collab) — 2026*


