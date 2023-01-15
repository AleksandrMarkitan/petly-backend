const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
// const fs = require("fs/promises");
// const path = require("path");
// const Jimp = require("jimp");
// const { nanoid } = require("nanoid");
const { User } = require("../models/user");
const { Pet } = require("../models/pets");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    city: newUser.city,
    phone: newUser.phone,
    avatarURL: newUser.avatarURL,
    birthday: newUser.birthday,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { name, email, birthday, phone, city, pets } = req.user;
  const { _id: owner } = req.user;
  const result = await Pet.find({ owner });

  req.user.pets.push(...result);
  res.json({ name, email, birthday, phone, city, pets });
};

// const updateUserData = async (req, res) => {
//   const { _id } = req.user;
//   console.log("updateUserData:", _id);
//   const result = await User.findByIdAndUpdate(_id, req.body, {
//     new: true,
//   });

//   console.log("res:", result);

//   if (!result) {
//     console.log("Error:", result);

//     throw HttpError(404);
//   }
//   res.json(result);
// };

// const updateAvatar = async (req, res) => {
//   const { _id } = req.user;
//   const { path: tempUpload, originalname } = req.file;
//   const filename = `${_id}_${originalname}`;
//   const resultUpload = path.join(avatarsDir, filename);
//   Jimp.read(tempUpload, (err, img) => {
//     if (err) throw err;
//     img.resize(250, 250).write(resultUpload);
//   });
//   await fs.unlink(tempUpload);
//   const avatarURL = path.join("avatars", filename);
//   await User.findByIdAndUpdate(_id, { avatarURL });

//   res.json({
//     avatarURL,
//   });
// };

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  //   updateUserData: ctrlWrapper(updateUserData),
  logout: ctrlWrapper(logout),
};
