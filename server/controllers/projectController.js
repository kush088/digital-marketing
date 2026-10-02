import Project from "../models/Project.js";
import imagekit from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";

// =========================================
// Upload a file to ImageKit
// =========================================

const uploadToImageKit = async (file, folder) => {
  if (!file || !file.buffer) {
    return null;
  }

  const imageKitFile = await toFile(
    file.buffer,
    file.originalname
  );

  const response = await imagekit.files.upload({
    file: imageKitFile,
    fileName: file.originalname,
    folder,
  });

  return {
    url: response.url,
    fileId: response.fileId,
    fileName: response.name,
  };
};

// =========================================
// GET /api/projects
// =========================================

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// =========================================
// GET /api/projects/:id
// =========================================

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// =========================================
// POST /api/projects
// =========================================

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      techStack,
      githubLink,
      liveLink,
      featured,
      order,
    } = req.body;

    // -----------------------------------------
    // Upload project images to ImageKit
    // -----------------------------------------

    const imageFiles = req.files?.images || [];
    const uploadedImages = [];

    for (const file of imageFiles) {
      const uploaded = await uploadToImageKit(
        file,
        "/kushparekh-portfolio/projects"
      );

      if (uploaded) {
        uploadedImages.push(uploaded.url);
      }
    }

    // -----------------------------------------
    // Upload case study to ImageKit
    // -----------------------------------------

    const downloadFileObj =
      req.files?.downloadFile?.[0];

    let downloadFileUrl;
    let downloadFileName;

    if (downloadFileObj) {
      const uploadedDownload =
        await uploadToImageKit(
          downloadFileObj,
          "/kushparekh-portfolio/case-studies"
        );

      if (uploadedDownload) {
        downloadFileUrl = uploadedDownload.url;
        downloadFileName =
          downloadFileObj.originalname;
      }
    }

    // -----------------------------------------
    // Create project
    // -----------------------------------------

    const project = await Project.create({
      title,
      description,
      category,

      techStack: techStack
        ? techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],

      githubLink,
      liveLink,

      images: uploadedImages,

      downloadFile: downloadFileUrl,
      downloadFileName,

      featured: featured === "true",

      order: order ? Number(order) : 0,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// =========================================
// PUT /api/projects/:id
// =========================================

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const {
      title,
      description,
      category,
      techStack,
      githubLink,
      liveLink,
      featured,
      order,
      removeImages,
    } = req.body;

    // -----------------------------------------
    // Update basic fields
    // -----------------------------------------

    if (title !== undefined) {
      project.title = title;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (category !== undefined) {
      project.category = category;
    }

    if (techStack !== undefined) {
      project.techStack = techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (githubLink !== undefined) {
      project.githubLink = githubLink;
    }

    if (liveLink !== undefined) {
      project.liveLink = liveLink;
    }

    if (featured !== undefined) {
      project.featured = featured === "true";
    }

    if (order !== undefined) {
      project.order = Number(order);
    }

    // -----------------------------------------
    // Remove selected images
    // -----------------------------------------

    if (removeImages) {
      try {
        const toRemove = JSON.parse(removeImages);

        if (Array.isArray(toRemove)) {
          project.images = project.images.filter(
            (img) => !toRemove.includes(img)
          );
        }
      } catch (error) {
        console.error(
          "Invalid removeImages value:",
          error
        );
      }
    }

    // -----------------------------------------
    // Upload newly added images
    // -----------------------------------------

    const newImageFiles =
      req.files?.images || [];

    if (newImageFiles.length > 0) {
      const newImages = [];

      for (const file of newImageFiles) {
        const uploaded = await uploadToImageKit(
          file,
          "/kushparekh-portfolio/projects"
        );

        if (uploaded) {
          newImages.push(uploaded.url);
        }
      }

      project.images = [
        ...project.images,
        ...newImages,
      ];
    }

    // -----------------------------------------
    // Replace case study
    // -----------------------------------------

    const downloadFileObj =
      req.files?.downloadFile?.[0];

    if (downloadFileObj) {
      const uploadedDownload =
        await uploadToImageKit(
          downloadFileObj,
          "/kushparekh-portfolio/case-studies"
        );

      if (uploadedDownload) {
        project.downloadFile =
          uploadedDownload.url;

        project.downloadFileName =
          downloadFileObj.originalname;
      }
    }

    // -----------------------------------------
    // Save project
    // -----------------------------------------

    await project.save();

    res.json(project);
  } catch (err) {
    console.error("Update project error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// =========================================
// DELETE /api/projects/:id
// =========================================

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    /*
      Project files are stored on ImageKit.

      We delete the MongoDB project record here.
      The ImageKit files are not deleted from the
      local Render/server filesystem.
    */

    await project.deleteOne();

    res.json({
      message: "Project deleted",
    });
  } catch (err) {
    console.error("Delete project error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// =========================================
// GET /api/projects/:id/download
// =========================================

export const downloadProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project || !project.downloadFile) {
      return res.status(404).json({
        message:
          "No downloadable file for this project",
      });
    }

    // Redirect directly to ImageKit
    res.redirect(project.downloadFile);
  } catch (err) {
    console.error(
      "Download project error:",
      err
    );

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};