import path from "path";
import fs from "fs";
import Project from "../models/Project.js";

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/projects  (admin, multipart/form-data)
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, featured, order } = req.body;

    const images = (req.files?.images || []).map((f) => `/uploads/${f.filename}`);
    const downloadFileObj = req.files?.downloadFile?.[0];

    const project = await Project.create({
      title,
      description,
      techStack: techStack ? techStack.split(",").map((t) => t.trim()) : [],
      githubLink,
      liveLink,
      images,
      downloadFile: downloadFileObj ? `/uploads/${downloadFileObj.filename}` : undefined,
      downloadFileName: downloadFileObj ? downloadFileObj.originalname : undefined,
      featured: featured === "true",
      order: order ? Number(order) : 0,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/projects/:id (admin, multipart/form-data)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { title, description, techStack, githubLink, liveLink, featured, order, removeImages } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (techStack !== undefined) project.techStack = techStack.split(",").map((t) => t.trim());
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (liveLink !== undefined) project.liveLink = liveLink;
    if (featured !== undefined) project.featured = featured === "true";
    if (order !== undefined) project.order = Number(order);

    // Remove selected existing images
    if (removeImages) {
      const toRemove = JSON.parse(removeImages); // array of image paths
      toRemove.forEach((imgPath) => {
        const filePath = path.join(process.cwd(), imgPath);
        fs.existsSync(filePath) && fs.unlinkSync(filePath);
      });
      project.images = project.images.filter((img) => !toRemove.includes(img));
    }

    // Add newly uploaded images
    const newImages = (req.files?.images || []).map((f) => `/uploads/${f.filename}`);
    project.images = [...project.images, ...newImages];

    // Replace download file if a new one was uploaded
    const downloadFileObj = req.files?.downloadFile?.[0];
    if (downloadFileObj) {
      if (project.downloadFile) {
        const oldPath = path.join(process.cwd(), project.downloadFile);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }
      project.downloadFile = `/uploads/${downloadFileObj.filename}`;
      project.downloadFileName = downloadFileObj.originalname;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/projects/:id (admin)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    [...project.images, project.downloadFile].filter(Boolean).forEach((filePath) => {
      const fullPath = path.join(process.cwd(), filePath);
      fs.existsSync(fullPath) && fs.unlinkSync(fullPath);
    });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/projects/:id/download (public)
export const downloadProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !project.downloadFile) {
      return res.status(404).json({ message: "No downloadable file for this project" });
    }
    const filePath = path.join(process.cwd(), project.downloadFile);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }
    res.download(filePath, project.downloadFileName || path.basename(filePath));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
