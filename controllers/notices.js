const { Notice } = require("../models/notice");

const { HttpError, ctrlWrapper } = require("../helpers");

// отримання оголошень по категоріям
const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filter } = req.query;
  const skip = (page - 1) * limit;
  // const query = !favorite ? { owner } : { owner, favorite: true };
  const data = await Notice.find({ owner, ...filter }, { skip, limit: +limit });

  if (data.length) {
    return res.json(data);
  }
  res.status(204).json({ message: "No Content" });
};

// отримання одного оголошення
const getOne = async (req, res) => {
  const { noticeId } = req.params;

  const result = await Notice.findById(noticeId).populate(
    "owner",
    "name email"
  );
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

// додавання оголошення до обраних
const updateFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { favoriteNotices } = req.user;

  const newFavoritesNotices = favoriteNotices.push(noticeId);

  const result = await User.findByIdAndUpdate(
    noticeId,
    { favoriteNotices: newFavoritesNotices },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

// отримання оголошень авторизованого користувача доданих ним же в обрані
const getFavorites = async (req, res) => {
  const { favoriteNotices } = req.user;

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  // const query = !favorite ? { owner } : { owner, favorite: true };
  const data = await Notice.findById(
    { _id: favoriteNotices },
    { skip, limit: +limit }
  ); //узнать как найти несколько объявлений по id

  if (data.length) {
    return res.json(data);
  }
  res.status(204).json({ message: "No Content" });
};

// видалення оголошення авторизованого користувача доданих цим же до обраних
const deleteFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { favoriteNotices } = req.user;

  const index = favoriteNotices.indexOf(noticeId);

  favoriteNotices.splice(index, 1);

  const result = await User.findByIdAndUpdate(noticeId, favoriteNotices, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Notice.create({ ...req.body, owner });
  res.status(201).json(result);
};

//отримання оголошень авторизованого користувача створених цим же користувачем
const getOwner = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Notice.find(owner, "", { skip, limit }).populate(
    "owner",
    "name email"
  );
  res.json(contacts);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getOne: ctrlWrapper(getOne),
  add: ctrlWrapper(add),
  updateFavorite: ctrlWrapper(updateFavorite),
  getFavorites: ctrlWrapper(getFavorites),
  deleteFavorite: ctrlWrapper(deleteFavorite),
  getOwner: ctrlWrapper(getOwner),
};
