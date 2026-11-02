import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import setupRoutes from "./routes/setupRoutes.js";


dotenv.config();

connectDB();

const app = express();

// --------------------------------------------------
// PATH SETUP
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(express.json());

// --------------------------------------------------
// UPLOADS
// --------------------------------------------------

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

// --------------------------------------------------
// API HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Kush Parekh portfolio API is running",
  });
});

// --------------------------------------------------
// REACT PRODUCTION BUILD
// --------------------------------------------------

const clientDistPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

// --------------------------------------------------
// REACT SPA FALLBACK
// --------------------------------------------------

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// --------------------------------------------------
// SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});