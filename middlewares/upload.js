const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");
const client_max_body_size = 500000;
const multerConfig = multer.diskStorage({
  destination: tempDir,
});

const upload = multer({
  storage: multerConfig,
  limits: { fileSize: client_max_body_size },
});

module.exports = upload;
