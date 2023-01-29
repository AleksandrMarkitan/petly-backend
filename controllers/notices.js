const { Notice } = require("../models/notice");
const { User } = require("../models/user");
const { uploadImg } = require("../helpers");

const { HttpError, ctrlWrapper } = require("../helpers");

// отримання оголошень по категоріям та пошуку оголошення по ключовому слову в заголовку
const getAll = async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 8, qwery = "", ...filter } = req.query;
  const skip = (page - 1) * limit;
  if (qwery === "") {
    const dataCount = await Notice.count({ category,...filter });
    const data = await Notice.find({ category,...filter }, "", {
      skip,
      limit: +limit,
    }).populate("owner", "email");

    return res.json({
      total: dataCount,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(dataCount / limit),
      notices: data,
    });
  } else {
    const dataCount = await Notice.count({
      title: { $regex: qwery, $options: "i" },category,
      ...filter,
    });
    const data = await Notice.find(
      { title: { $regex: qwery, $options: "i" }, category,...filter },
      "",
      {
        skip,
        limit: +limit,
      }
    ).populate("owner", "email");

    return res.json({
      total: dataCount,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(dataCount / limit),
      notices: data,
    });
  }
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

// отримання оголошень авторизованого користувача доданих ним же в обрані та пошуку оголошення по ключовому слову в заголовку
const getFavorites = async (req, res) => {
  const { favoriteNotices } = req.user;
  const { qwery = "", page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;
  if (qwery === "") {
    const dataCount = await Notice.count({ _id: favoriteNotices });
    const data = await Notice.find({ _id: favoriteNotices }, "", {
      skip,
      limit: +limit,
    }).populate("owner", "email");

    if (data.length) {
      return res.json({
        total: dataCount,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(dataCount / limit),
        notices: data,
      });
    }
    res.status(204).json({ message: "No Content" });
  } else {
    const data = await Notice.find({ _id: favoriteNotices }, "", {
      skip,
      limit: +limit,
    }).populate("owner", "email");

    if (data.length) {
      const result = data.filter((notice) =>
        notice.title.toLowerCase().includes(qwery.toLowerCase())
      );
      return res.json({
        total: result.length,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(result.length / limit),
        notices: result,
      });
    }
    res.status(204).json({ message: "No Content" });
  }
};

// додавання оголошень відповідно до обраної категорії

const add = async (req, res) => {
  const { _id: owner, email } = req.user;
  // додаємо зображення
  const dafaultImgURL =
    "http://res.cloudinary.com/digml0rat/image/upload/v1673906206/Fullstack%20Group%20Project/home-pets_hywfgq.png";
  const transformation = [
    { width: 336, height: 336, gravity: "auto", crop: "fill" },
  ];
  const imgToSend = await uploadImg(
    req.file?.path,
    dafaultImgURL,
    transformation
  );

  const result = await Notice.create({
    ...req.body,
    owner,
    imgURL: imgToSend,
  });
  res.status(201).json({ ...result._doc, owner: { owner, email } });
};

// отримання оголошень авторизованого користувача створених цим же користувачем та пошуку оголошення по ключовому слову в заголовку
const getOwner = async (req, res) => {
  const { _id: owner } = req.user;
  const { qwery = "", page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;
  if (qwery === "") {
    const dataCount = await Notice.count({ owner });
    const data = await Notice.find({ owner }, "", { skip, limit }).populate(
      "owner",
      "name email"
    );
    return res.json({
      total: dataCount,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(dataCount / limit),
      notices: data,
    });
  } else {
    const dataCount = await Notice.count({
      owner,
      title: { $regex: qwery, $options: "i" },
    });
    const data = await Notice.find(
      { owner, title: { $regex: qwery, $options: "i" } },
      "",
      { skip, limit }
    ).populate("owner", "name email");
    return res.json({
      total: dataCount,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(dataCount / limit),
      notices: data,
    });
  }
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
      throw HttpError(404, "Not Found in User favorite collection");
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
