import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "../config/r2client.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILES = 10;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    ALLOWED_MIME_TYPES.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("type invalid. Use JPEG, PNG, WEBP ou GIF."), false);
  },
});

export async function uploadToR2(buffer, mimetype, folder = "restaurants") {
  const ext = mimetype.split("/")[1].replace("jpeg", "jpg");
  const key = `${folder}/${uuidv4()}.${ext}`;
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  }));
  return R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL}/${key}`
    : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
}

export async function deleteFromR2(publicUrl) {
  if (!publicUrl) return;
  try {
    const base = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/`
      : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/`;
    if (!publicUrl.startsWith(base)) return;
    const key = publicUrl.slice(base.length);
    await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
  } catch (err) {
    console.error("Erro ao deletar do R2:", err.message);
  }
}

export function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Very large file. Maximum 5MB." });
    if (err.code === "LIMIT_FILE_COUNT") return res.status(400).json({ message: `maximum of  ${MAX_FILES} images.` });
    return res.status(400).json({ message: `Erro de upload: ${err.message}` });
  }
  if (err) return res.status(400).json({ message: err.message });
  next();
}