const cloudinary = require("./cloudinary");

const fs = require("fs/promises");

const Jimp = require("jimp");

const dafaultImgURL =
  "http://res.cloudinary.com/digml0rat/image/upload/v1673906206/Fullstack%20Group%20Project/home-pets_hywfgq.png";

const options = {
  use_filename: true,
  unique_filename: true,
  overwrite: true,
  transformation: [{ width: 336, height: 336, gravity: "faces", crop: "fill" }],
};

// завантаження зображення у хмару
const uploadImg = async (tempUpload) => {
  if (tempUpload) {
    const upload = await cloudinary.uploader.upload(tempUpload, options);

    // видаляємо з папки temp
    await fs.unlink(tempUpload);

    return upload.secure_url;
  }
  return dafaultImgURL;
};

module.exports = uploadImg;
