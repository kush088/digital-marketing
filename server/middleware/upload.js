import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
  ];

  const documentExtensions = [
    ".pdf",
    ".zip",
    ".rar",
    ".7z",
  ];

  if (
    imageExtensions.includes(ext) ||
    documentExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, GIF, PDF, ZIP, RAR and 7Z files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

export default upload;