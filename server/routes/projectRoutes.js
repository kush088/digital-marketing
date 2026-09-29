import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  downloadProject,
} from "../controllers/projectController.js";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "images", maxCount: 8 },
  { name: "downloadFile", maxCount: 1 },
]);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/:id/download", downloadProject);

router.post("/", protect, uploadFields, createProject);
router.put("/:id", protect, uploadFields, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
