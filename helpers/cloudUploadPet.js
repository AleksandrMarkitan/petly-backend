const cloudinary = require("./cloudinary");
const fs = require("fs/promises");

const dafaultImgURL =
  "https://res.cloudinary.com/dgne23at6/image/upload/v1674052318/f64cacccea6511bba2ae40b5383e3e47_ajipj3.jpg";

const options = {
  use_filename: true,
  unique_filename: true,
  overwrite: true,
  transformation: [{ width: 161, height: 161, gravity: "auto", crop: "fill" }],
};

// завантаження зображення у хмару
const uploadImgPet = async (tempUpload) => {
  if (tempUpload) {
    const upload = await cloudinary.uploader.upload(tempUpload, options);

    // видаляємо з папки temp
    await fs.unlink(tempUpload);

    return upload.secure_url;
  }
  return dafaultImgURL;
};

module.exports = uploadImgPet;
