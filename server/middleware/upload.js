import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|webp|gif/;
  const isImageField = file.fieldname === "images";
  const isDownloadField = file.fieldname === "downloadFile";

  if (isImageField) {
    const ext = imageTypes.test(path.extname(file.originalname).toLowerCase());
    if (!ext) return cb(new Error("Only image files are allowed for the images field"));
  }

  if (isDownloadField) {
    const allowed = /zip|pdf|rar|7z/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (!ext) return cb(new Error("Download file must be a .zip, .rar, .7z or .pdf"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

export default upload;
