const { Friend } = require("../models/friends");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Friend.find({}, "-__v");
  res.status(200).json(result);
};
module.exports = {
  getAll: ctrlWrapper(getAll),
};
