# Kush Parekh — Portfolio (frontend)

Plain CSS throughout — no Tailwind, no pink. Design tokens (in
`src/index.css`) use a deep indigo background with a violet→cyan
"gradient" accent and amber for warnings/errors.

```
--bg: #12101c       background
--surface: #1c1830  card background
--surface-2: #272140 borders
--ink: #f4f2fb      primary text
--muted: #aca3c7    secondary text
--violet: #7c5cff   primary accent
--cyan: #22d3ee     secondary accent / links
--amber: #ffb020    error/warning text
```

Sora for headings, Inter for body (loaded via Google Fonts in `index.css`).

## Install

```bash
npm install react-router-dom axios
```

No Tailwind, no PostCSS config needed — each component/page imports its
own plain `.css` file (e.g. `Navbar.jsx` imports `Navbar.css`), and
`src/index.css` holds the shared tokens plus reusable classes
(`.btn`, `.btn-primary`, `.btn-outline`, `.card`, `.badge`, `.field`,
`.container`, `.section`).

## Environment

Create `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Backend endpoints these components call

- `POST /api/auth/login` → `{ token, admin }`
- `GET /api/auth/me` (Bearer token) → admin profile
- `GET /api/projects` (optional `?featured=true&limit=3`)
- `GET /api/projects/:id`
- `POST /api/projects` (Bearer token)
- `PUT /api/projects/:id` (Bearer token)
- `DELETE /api/projects/:id` (Bearer token)
- `POST /api/contact`

Project shape:

```json
{
  "_id": "...",
  "title": "",
  "summary": "",
  "description": "",
  "image": "",
  "tags": ["SEO"],
  "result": "+42% organic traffic",
  "client": "",
  "timeline": "",
  "downloadUrl": "",
  "featured": true
}
```

## Files

```
src/
  index.css                   tokens + shared classes (buttons, cards, fields)
  context/AuthContext.jsx     admin session, login/logout
  components/
    Navbar.jsx + Navbar.css
    Footer.jsx + Footer.css
    ProjectCard.jsx + ProjectCard.css
    ProtectedRoute.jsx
  pages/
    Home.jsx + Home.css
    About.jsx + About.css
    Projects.jsx + Projects.css     filterable grid
    ProjectDetail.jsx + ProjectDetail.css
    Contact.jsx + Contact.css       posts to /api/contact
    AdminLogin.jsx + AdminLogin.css
    AdminDashboard.jsx + AdminDashboard.css   table + add/edit/delete modal
  App.jsx                     routes
  main.jsx                    entry, wraps Router + AuthProvider
```
