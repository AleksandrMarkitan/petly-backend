const cloudinary = require("./cloudinary");
const fs = require("fs/promises");

// завантаження зображення у хмару
const uploadImgPet = async (tempUpload, dafaultImgURL, transformation) => {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    transformation,
  };
  if (tempUpload) {
    const upload = await cloudinary.uploader.upload(tempUpload, options);

    // видаляємо з папки temp
    await fs.unlink(tempUpload);

    return upload.secure_url;
  }
  return dafaultImgURL;
};

module.exports = uploadImgPet;
