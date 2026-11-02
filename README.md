# Kush Parekh — Full-Stack MERN Developer Portfolio

This repository is the existing MERN portfolio updated from a digital-marketing portfolio to a full-stack developer portfolio.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT admin authentication
- Existing project/contact APIs and upload middleware

## Run locally
1. Install root/server/client dependencies as required by your deployment setup.
2. Configure the server `.env` with `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.
3. Configure the client `VITE_API_URL` to point to your API base, for example `http://localhost:5000/api`.
4. Start the backend from `server` with `npm run dev`.
5. Start the frontend from `client` with `npm run dev`.

## Project content
The admin dashboard now uses the current project model fields: title, shortDescription, description, category, projectRole, techStack, keyFeatures, githubLink, liveLink, featured and order.

Existing project documents remain compatible. The model adds optional fields; old documents do not need to be deleted or recreated.

## Important deployment note
This ZIP contains source code only. Keep your existing production environment variables, MongoDB database, uploaded media and hosting configuration. Deploy the updated client and server after testing in a staging/local environment.
