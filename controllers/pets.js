const { Pet } = require("../models/pets");

const { HttpError, ctrlWrapper } = require("../helpers");

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Pet.create({ ...req.body, owner });
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
