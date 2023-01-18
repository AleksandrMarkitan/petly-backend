const { HttpError, ctrlWrapper, uploadImgPet } = require("../helpers");
const { Pet } = require("../models/pets");

const dafaultImgURL =
  "https://res.cloudinary.com/dgne23at6/image/upload/v1674052318/f64cacccea6511bba2ae40b5383e3e47_ajipj3.jpg";
const transformationSmall = [
  { width: 161, height: 161, gravity: "auto", crop: "fill" },
];
const transformationLage = [{ gravity: "auto", crop: "fill" }];

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const avatarPetSmall = await uploadImgPet(
    req.file.path,
    dafaultImgURL,
    transformationSmall
  );
  const avatarPetLage = await uploadImgPet(
    req.file.path,
    dafaultImgURL,
    transformationLage
  );
  const result = await Pet.create({
    ...req.body,
    owner,
    avatarURL_small: avatarPetSmall,
    avatarURL_lage: avatarPetLage,
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
