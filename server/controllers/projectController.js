import Project from "../models/Project.js";
import imagekit from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";

const MAX_IMAGE_SIZE = 25 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const uploadToImageKit = async (file, folder) => {
  if (!file || !file.buffer) return null;

  const imageKitFile = await toFile(file.buffer, file.originalname);

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

const getFile = (req, fieldName) => {
  return req.files?.[fieldName]?.[0] || null;
};

const validateFileSize = (file, maxSize, label) => {
  if (file && file.size > maxSize) {
    throw new Error(`${label} must not exceed ${maxSize / (1024 * 1024)} MB.`);
  }
};

const validateProjectFiles = (req) => {
  const images = req.files?.images || [];
  const thumbnail = getFile(req, "thumbnail");
  const video = getFile(req, "video");
  const downloadFile = getFile(req, "downloadFile");

  for (const image of images) {
    validateFileSize(image, MAX_IMAGE_SIZE, "Each project image");
  }

  validateFileSize(thumbnail, MAX_IMAGE_SIZE, "Thumbnail");
  validateFileSize(video, MAX_VIDEO_SIZE, "Video");
  validateFileSize(downloadFile, MAX_DOCUMENT_SIZE, "Case-study document");
};

const parseTechStack = (techStack) => {
  if (Array.isArray(techStack)) return techStack;

  if (typeof techStack === "string") {
    return techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const uploadImages = async (files, folder) => {
  const uploadedImages = [];

  for (const file of files || []) {
    const uploaded = await uploadToImageKit(file, folder);

    if (uploaded) {
      uploadedImages.push(uploaded.url);
    }
  }

  return uploadedImages;
};

const uploadThumbnail = async (file) => {
  if (!file) return undefined;

  const uploaded = await uploadToImageKit(
    file,
    "/kushparekh-portfolio/thumbnails"
  );

  return uploaded?.url;
};

const uploadVideo = async (file) => {
  if (!file) return undefined;

  const uploaded = await uploadToImageKit(
    file,
    "/kushparekh-portfolio/videos"
  );

  return uploaded?.url;
};

// GET all projects
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

// GET one project
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

// CREATE project
export const createProject = async (req, res) => {
  try {
    validateProjectFiles(req);

    const {
      title,
      description,
      category,
      techStack,
      githubLink,
      liveLink,
      featured,
      order,
      projectType,
      videoSource,
      videoUrl,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required.",
      });
    }

    const finalProjectType = projectType === "video" ? "video" : "image";

    const finalVideoSource =
      videoSource === "external" ? "external" : "upload";

    const videoFile = getFile(req, "video");
    const thumbnailFile = getFile(req, "thumbnail");

    if (finalProjectType === "video") {
      if (finalVideoSource === "upload" && !videoFile) {
        return res.status(400).json({
          message: "Please upload a video file.",
        });
      }

      if (
        finalVideoSource === "external" &&
        (!videoUrl || !videoUrl.trim())
      ) {
        return res.status(400).json({
          message: "Please provide an external video URL.",
        });
      }
    }

    const uploadedImages = await uploadImages(
      req.files?.images,
      "/kushparekh-portfolio/projects"
    );

    const uploadedVideo =
      finalProjectType === "video" && finalVideoSource === "upload"
        ? await uploadVideo(videoFile)
        : undefined;

    const uploadedThumbnail = await uploadThumbnail(thumbnailFile);

    const downloadFileObj = getFile(req, "downloadFile");
    let downloadFileUrl;
    let downloadFileName;

    if (downloadFileObj) {
      const uploadedDownload = await uploadToImageKit(
        downloadFileObj,
        "/kushparekh-portfolio/case-studies"
      );

      if (uploadedDownload) {
        downloadFileUrl = uploadedDownload.url;
        downloadFileName = downloadFileObj.originalname;
      }
    }

    const project = await Project.create({
      title,
      description,
      category,
      techStack: parseTechStack(techStack),
      githubLink,
      liveLink,
      images: uploadedImages,
      projectType: finalProjectType,
      videoSource: finalProjectType === "video" ? finalVideoSource : "upload",
      videoUrl:
        finalProjectType === "video"
          ? finalVideoSource === "external"
            ? videoUrl.trim()
            : uploadedVideo
          : undefined,
      thumbnail: uploadedThumbnail,
      downloadFile: downloadFileUrl,
      downloadFileName,
      featured: featured === "true" || featured === true,
      order: order ? Number(order) : 0,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);

    const isSizeError = err.message.includes("must not exceed");

    res.status(isSizeError ? 413 : 500).json({
      message: err.message || "Server error",
    });
  }
};

// UPDATE project
export const updateProject = async (req, res) => {
  try {
    validateProjectFiles(req);

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
      projectType,
      videoSource,
      videoUrl,
    } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (category !== undefined) project.category = category;

    if (techStack !== undefined) {
      project.techStack = parseTechStack(techStack);
    }

    if (githubLink !== undefined) project.githubLink = githubLink;
    if (liveLink !== undefined) project.liveLink = liveLink;

    if (featured !== undefined) {
      project.featured = featured === "true" || featured === true;
    }

    if (order !== undefined) {
      project.order = Number(order);
    }

    if (projectType !== undefined) {
      project.projectType = projectType === "video" ? "video" : "image";
    }

    if (videoSource !== undefined) {
      project.videoSource =
        videoSource === "external" ? "external" : "upload";
    }

    if (videoUrl !== undefined) {
      project.videoUrl = videoUrl.trim();
    }

    if (removeImages) {
      try {
        const toRemove = JSON.parse(removeImages);

        if (Array.isArray(toRemove)) {
          project.images = project.images.filter(
            (image) => !toRemove.includes(image)
          );
        }
      } catch (error) {
        console.error("Invalid removeImages value:", error);
      }
    }

    const newImageFiles = req.files?.images || [];

    if (newImageFiles.length > 0) {
      const newImages = await uploadImages(
        newImageFiles,
        "/kushparekh-portfolio/projects"
      );

      project.images = [...project.images, ...newImages];
    }

    const videoFile = getFile(req, "video");
    const thumbnailFile = getFile(req, "thumbnail");
    const downloadFileObj = getFile(req, "downloadFile");

    if (videoFile) {
      project.videoUrl = await uploadVideo(videoFile);
      project.projectType = "video";
      project.videoSource = "upload";
    }

    if (thumbnailFile) {
      project.thumbnail = await uploadThumbnail(thumbnailFile);
    }

    if (downloadFileObj) {
      const uploadedDownload = await uploadToImageKit(
        downloadFileObj,
        "/kushparekh-portfolio/case-studies"
      );

      if (uploadedDownload) {
        project.downloadFile = uploadedDownload.url;
        project.downloadFileName = downloadFileObj.originalname;
      }
    }

    if (project.projectType === "video") {
      if (
        project.videoSource === "external" &&
        !project.videoUrl
      ) {
        return res.status(400).json({
          message: "Please provide an external video URL.",
        });
      }

      if (
        project.videoSource === "upload" &&
        !project.videoUrl
      ) {
        return res.status(400).json({
          message: "Please upload a video file.",
        });
      }
    }

    await project.save();

    res.json(project);
  } catch (err) {
    console.error("Update project error:", err);

    const isSizeError = err.message.includes("must not exceed");

    res.status(isSizeError ? 413 : 500).json({
      message: err.message || "Server error",
    });
  }
};

// DELETE project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

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

// DOWNLOAD case-study file
export const downloadProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || !project.downloadFile) {
      return res.status(404).json({
        message: "No downloadable file for this project",
      });
    }

    res.redirect(project.downloadFile);
  } catch (err) {
    console.error("Download project error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};