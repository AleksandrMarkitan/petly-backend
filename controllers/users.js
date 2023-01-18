const fs = require("fs/promises");
const { cloudinary } = require("../helpers");
const { User, schemas } = require("../models/user");
const { Pet } = require("../models/pets");
const { HttpError, ctrlWrapper } = require("../helpers");

const getCurrent = async (req, res) => {
  const { name, email, birthday, phone, city, pets } = req.user;
  const { _id: owner } = req.user;
  const result = await Pet.find({ owner });

  req.user.pets.push(...result);
  res.json({ name, email, birthday, phone, city, pets });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload } = req.file;

  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    transformation: [
      { width: 233, height: 233, gravity: "face", crop: "thumb" },
    ],
  };

  const upload = await cloudinary.uploader.upload(tempUpload, options);

  await fs.unlink(tempUpload);

  await User.findByIdAndUpdate(_id, { avatarURL: upload.secure_url });

  res.json({
    avatarURL: upload.secure_url,
  });
};

const updateUserData = async (req, res) => {
  if (req.file) {
    updateAvatar(req, res);
    return;
  }

  const { error } = schemas.updateSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUserData: ctrlWrapper(updateUserData),
};
