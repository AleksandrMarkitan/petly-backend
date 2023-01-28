const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
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
  const { email: enterEmail, password } = req.body;
  const user = await User.findOne({ email: enterEmail });
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

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "230h" });
  await User.findByIdAndUpdate(user._id, { token });

  const owner = user._id;
  const result = await Pet.find({ owner });
  user.pets.push(...result);

  const {
    name,
    email,
    birthday,
    phone,
    city,
    avatarURL,
    pets,
    favoriteNotices,
  } = user;

  res.json({
    token,
    user: {
      name,
      email,
      birthday,
      phone,
      city,
      avatarURL,
      pets,
      favoriteNotices,
    },
  });
};

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
  logout: ctrlWrapper(logout),
};
