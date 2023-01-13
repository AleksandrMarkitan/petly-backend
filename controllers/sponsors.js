const { Sponsor } = require("../models/sponsors");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Sponsor.find({}, "-__v");
  res.status(200).json(result);
};
module.exports = {
  getAll: ctrlWrapper(getAll),
};
