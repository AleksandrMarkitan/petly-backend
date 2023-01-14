const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
    },
    phone: {
      type: String,
      required: [true, "Mobile phone is required"],
    },
    avatarURL: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      default: "00.00.0000",
    },
    favoriteNotices: [
      { type: Schema.Types.ObjectId, ref: "notice", required: true },
    ],
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(7).required(),
  city: Joi.string().required(),
  phone: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(7).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
