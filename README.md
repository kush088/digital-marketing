# kushparekh — Digital marketing portfolio

A full-stack portfolio site: public pages (Home, About, Projects, Project Detail, Contact)
plus a password-protected admin panel to create/edit/delete projects, upload images,
and attach a downloadable file per project (visitors get a "Download project" button).

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB
- **Auth:** JWT (single admin account, seeded via script)
- **Uploads:** Multer, stored in `server/uploads` and served statically

## Folder structure
```
kushparekh-portfolio/
├── server/     Express API, MongoDB models, admin auth, file uploads
└── client/     React app (public site + admin dashboard)
```

## 1. Prerequisites
- Node.js 18+
- A MongoDB database — either local (`mongod`) or a free MongoDB Atlas cluster

## 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/kushparekh_portfolio
JWT_SECRET=replace_with_a_long_random_string
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=choose_a_strong_password
CLIENT_URL=http://localhost:5173
```

Create your admin login (run once):
```bash
npm run seed:admin
```

Start the API:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 3. Frontend setup
```bash
cd client
npm install
cp .env.example .env
```
`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the site:
```bash
npm run dev
```
The site runs at `http://localhost:5173`.

## 4. Using the admin panel
1. Go to `http://localhost:5173/admin/login`
2. Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `server/.env`
3. Add a project: title, description, tech stack, optional GitHub/live links,
   one or more images, and an optional downloadable file (.zip, .rar, .7z, .pdf)
4. Saved projects immediately appear on the public `/projects` page, and the
   download file (if attached) shows as a "Download project" button on that
   project's detail page.

## 5. Deploying (when you're ready)
- **Frontend:** Vercel or Netlify (`npm run build` → deploy the `dist` folder)
- **Backend:** Render or Railway (set the same env vars as your `.env`)
- **Database:** MongoDB Atlas (free tier is enough to start)
- **File storage:** for production, swap local `uploads/` for Cloudinary or S3 —
  local disk storage gets wiped on most free hosts' redeploys. The upload
  middleware (`server/middleware/upload.js`) is the only place you'd need to change.

## Design
The UI uses a dark, developer-portfolio palette (near-black background,
amber accent, monospace display type) defined as Tailwind tokens in
`client/tailwind.config.js` — change `ink`, `paper`, `signal`, `wire`, and `mist`
there to re-theme the whole site.
