const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const nameRegexp = /^[a-zA-Z]{2,20}$/;
const emailRegexp =
  /^[^-]{1}[A-Za-z0-9._-]{2,}@[^-]{1}[A-Za-z0-9.-]{2,}\.[A-Za-z]{2,4}$/;
const phoneRegexp = /^\+\d{12}$/;
const passwordRegexp = /^[A-Za-z0-9!?#$%^&_\-\*]{7,32}$/;
const cityRegexp = /^([^0-9][A-Za-z-\s]{2,})*,([^0-9][A-Za-z-\s]{2,})*/;
const birthdayRegexp =
  /^(?:0[1-9]|[12][0-9]|3[01])[.](?:0[1-9]|1[012])[.](?:19\d{2}|20[01][0-9]|2020)\b$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      match: nameRegexp,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      minLength: 7,
      required: [true, "Password is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      match: cityRegexp,
    },
    phone: {
      type: String,
      required: [true, "Mobile phone is required"],
      match: phoneRegexp,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      default: "01.01.1970",
      match: birthdayRegexp,
    },
    pets: { type: Array, required: true },
    favoriteNotices: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "notice",
      default: [],
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(20).pattern(nameRegexp).required(),
  email: Joi.string().min(10).max(63).pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
  city: Joi.string().max(50).pattern(cityRegexp).required(),
  phone: Joi.string().pattern(phoneRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(20).pattern(nameRegexp),
  email: Joi.string().min(10).max(63).pattern(emailRegexp),
  city: Joi.string().max(50).pattern(cityRegexp),
  phone: Joi.string().pattern(phoneRegexp),
  birthday: Joi.string().pattern(birthdayRegexp),
}).min(1);

const schemas = {
  registerSchema,
  loginSchema,
  updateSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
