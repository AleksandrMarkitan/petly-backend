const { Notice } = require("../models/notice");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  // const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite = false, category="sell",  } = req.query;
  // const skip = (page - 1) * limit;
  // const query = !favorite ? { owner } : { owner, favorite: true };
  const contacts = await Notice.find();
  res.json(contacts);
};

const updateFavorite = async (req, res) => {
  console.log("ctr");
  const { noticeId } = req.params;
  const { body } = req;
  if (Object.keys(body).length === 0) {
    throw HttpError(400, "missing field favorite");
  }
  const result = await Notice.findByIdAndUpdate(noticeId, body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  updateFavorite: ctrlWrapper(updateFavorite),
};
