
import dotenv from "dotenv";
import ImageKit from "@imagekit/nodejs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file located in the server directory
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

if (!privateKey) {
  throw new Error(
    "IMAGEKIT_PRIVATE_KEY is missing. Check server/.env"
  );
}

const imagekit = new ImageKit({
  privateKey,
});

export default imagekit;
