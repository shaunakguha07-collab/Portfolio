# Portfolio Backend & Admin Panel

This is a Node.js + Express backend with an SQLite database designed to securely receive messages from the portfolio site and display them on a protected admin dashboard.

## Running Locally

1. Open your terminal in the `server` directory.
2. Install dependencies (if not already done): `npm install`
3. Start the server:
   ```bash
   node server.js
   ```
4. Open the website: `http://localhost:3000`
5. Visit the Admin Panel: `http://localhost:3000/admin.html`
6. The default login password is: `admin123`

## Deployment Instructions

To make your website and database live and accessible from any device, follow these steps:

### Platform Recommendation: Render.com or Railway.app

1. **Push your code to GitHub.** Ensure the entire project (including the `server` folder) is in a GitHub repository.
2. **Create an account on Render** (or Railway).
3. **Deploy Web Service**:
   - Create a new "Web Service" and connect your GitHub repository.
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`
4. **Environment Variables**:
   It is highly recommended to override the default password in your host settings.
   - Add `ADMIN_PASSWORD` and set it to your secure, personal password.
   - Add `JWT_SECRET` and set it to a random complex string for securing your login tokens.
5. **Database Persistence**: 
   Since this uses SQLite (a single file `database.sqlite`), on free platforms like Render, the disk is wiped on every restart. 
   - **To keep your messages permanently stored**, you MUST add a "Disk" to your Render Web Service. Attach the disk to the `/server` mount path. 
   - Alternatively, you can swap `sqlite3` for a `pg` (PostgreSQL) database URL provided by Render Database for a robust, enterprise-scale setup.

Once deployed, Render will give you a live URL (e.g., `yourapp.onrender.com`). You can visit `yourapp.onrender.com/admin.html` from your phone or any device to securely read your messages!
