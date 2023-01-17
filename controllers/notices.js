const { Notice } = require("../models/notice");
const { User } = require("../models/user");
const { uploadImg } = require("../helpers");

const { HttpError, ctrlWrapper } = require("../helpers");

// const dafaultImgURL =
//   "http://res.cloudinary.com/digml0rat/image/upload/v1673906206/Fullstack%20Group%20Project/home-pets_hywfgq.png";

// отримання оголошень по категоріям
const getAll = async (req, res) => {
  const { page = 1, limit = 10, ...filter } = req.query;
  const skip = (page - 1) * limit;
  const data = await Notice.find({ ...filter }, "", { skip, limit: +limit });

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
    "name email phone"
  );
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

// додавання та видалення оголошення з обраних
const updateFavorite = async (req, res) => {
  const { noticeId } = req.params;
  const { _id, favoriteNotices = [] } = req.user;

  const indexId = favoriteNotices.indexOf(noticeId);

  if (indexId === -1) {
    favoriteNotices.push(noticeId);
  } else {
    favoriteNotices.splice(indexId, 1);
  }

  const result = await User.findByIdAndUpdate(
    _id,
    { favoriteNotices },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json({
    name: result.name,
    email: result.email,
    favoriteNotices: result.favoriteNotices,
  });
};

// отримання оголошень авторизованого користувача доданих ним же в обрані
const getFavorites = async (req, res) => {
  const { favoriteNotices } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const data = await Notice.find({ _id: favoriteNotices }, "", {
    skip,
    limit: +limit,
  });

  if (data.length) {
    return res.json(data);
  }
  res.status(204).json({ message: "No Content" });
};

// додавання оголошень відповідно до обраної категорії
const add = async (req, res) => {
  const { _id: owner } = req.user;
  // додаємо зображення
  const imgToSend = await uploadImg(req.file?.path);  

  const result = await Notice.create({
    ...req.body,
    owner,
    imgURL: imgToSend,
  });
  res.status(201).json(result);
};

//отримання оголошень авторизованого користувача створених цим же користувачем
const getOwner = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Notice.find({ owner }, "", { skip, limit }).populate(
    "owner",
    "name email"
  );
  res.json(contacts);
};

//  видалення оголошення авторизованого користувача створеного цим же користувачем
const deleteById = async (req, res) => {
  const { noticeId } = req.params;
  const { _id, favoriteNotices = [] } = req.user;

  const result = await Notice.findByIdAndRemove(noticeId);
  if (!result) {
    throw HttpError(404, "Not Found");
  }

  // видаляємо id з колекції favoriteNotices користувача
  const indexId = favoriteNotices.indexOf(noticeId);
  if (indexId >= 0) {
    favoriteNotices.splice(indexId, 1);
    const data = await User.findByIdAndUpdate(
      _id,
      { favoriteNotices },
      {
        new: true,
      }
    );
    if (!data) {
      throw HttpError(404, "Not Found");
    }
  }

  res.json({
    message: "Delete success",
  });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getOne: ctrlWrapper(getOne),
  add: ctrlWrapper(add),
  updateFavorite: ctrlWrapper(updateFavorite),
  getFavorites: ctrlWrapper(getFavorites),
  getOwner: ctrlWrapper(getOwner),
  deleteById: ctrlWrapper(deleteById),
};
