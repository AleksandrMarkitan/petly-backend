const { HttpError, ctrlWrapper, uploadImg } = require("../helpers");
const { Pet } = require("../models/pets");

const add = async (req, res) => {
  const { _id: owner } = req.user;

  const dafaultImgURL =
    "https://res.cloudinary.com/dgne23at6/image/upload/v1674052318/f64cacccea6511bba2ae40b5383e3e47_ajipj3.jpg";
  const transformation = [
    { width: 240, height: 240, gravity: "auto", crop: "fill" },
  ];
  const avatarPet = await uploadImg(
    req.file.path,
    dafaultImgURL,
    transformation
  );

  const result = await Pet.create({
    ...req.body,
    owner,
    avatarURL: avatarPet,
  });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Pet.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    message: "Pet deleted",
  });
};

module.exports = {
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
};
