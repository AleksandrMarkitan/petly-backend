const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const { cloudinary } = require("../helpers");
const { User, schemas } = require("../models/user");
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload } = req.file;

  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    transformation: [
      { width: 233, height: 233, gravity: "face", crop: "thumb" },
    ],
  };

  const upload = await cloudinary.uploader.upload(tempUpload, options);

  await fs.unlink(tempUpload);

  await User.findByIdAndUpdate(_id, { avatarURL: upload.secure_url });

  res.json({
    avatarURL: upload.secure_url,
  });
};

const updateUserData = async (req, res) => {
  if (req.file) {
    updateAvatar(req, res);
    return;
  }

  const { error } = schemas.updateSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
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
  getCurrent: ctrlWrapper(getCurrent),
  updateUserData: ctrlWrapper(updateUserData),
  logout: ctrlWrapper(logout),
};
