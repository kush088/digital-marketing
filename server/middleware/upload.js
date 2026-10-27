import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const documentExtensions = [".pdf", ".zip", ".rar", ".7z"];
const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];

const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

const allowedDocumentMimeTypes = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/vnd.rar",
  "application/x-7z-compressed",
  "application/octet-stream",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype || "";

  if (imageExtensions.includes(ext)) {
    if (!mimeType.startsWith("image/")) {
      return cb(new Error("Invalid image file type."));
    }

    return cb(null, true);
  }

  if (videoExtensions.includes(ext)) {
    if (!mimeType.startsWith("video/")) {
      return cb(new Error("Invalid video file type."));
    }

    return cb(null, true);
  }

  if (documentExtensions.includes(ext)) {
    if (!allowedDocumentMimeTypes.includes(mimeType)) {
      return cb(new Error("Invalid document file type."));
    }

    return cb(null, true);
  }

  return cb(
    new Error(
      "Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, GIF, PDF, ZIP, RAR, 7Z, MP4, WEBM, MOV and M4V."
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_VIDEO_SIZE,
    files: 11,
  },
});

export {
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
  MAX_VIDEO_SIZE,
};

export default upload;