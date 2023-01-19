const gravatar = require("gravatar");

const { User, schemas } = require("../models/user");
const { Pet } = require("../models/pets");
const { HttpError, ctrlWrapper, uploadImg } = require("../helpers");

const getCurrent = async (req, res) => {
  const { name, email, birthday, phone, city, avatarURL, pets } = req.user;
  const { _id: owner } = req.user;
  const result = await Pet.find({ owner });

  req.user.pets.push(...result);
  res.json({ name, email, birthday, phone, city, avatarURL, pets });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const dafaultImgURL = gravatar.url(_id);
  const transformation = [
    { width: 233, height: 233, gravity: "face", crop: "thumb" },
  ];
  const newAvatar = await uploadImg(
    req.file?.path,
    dafaultImgURL,
    transformation
  );

  await User.findByIdAndUpdate(_id, { avatarURL: newAvatar });

  res.json({
    avatarURL: newAvatar,
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
