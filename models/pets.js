const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const DATE_REGEXP = /^\d{2}\.\d{2}\.\d{4}$/;

const petSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: [true, "Name is required"],
    },
    date: {
      type: String,
      default: Date.now,
      match: [DATE_REGEXP, "Date must be in format 22.10.2022"],
      required: true,
    },
    breed: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: [true, "Breed is required"],
    },
    avatarURL: {
      type: String,
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 120,
      requered: [true, "Comments is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

petSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().min(2).max(16).required(),
  date: Joi.string().required(),
  breed: Joi.string().min(2).max(16).required(),
  avatarURL: Joi.string(),
  comments: Joi.string().min(8).max(120).required(),
});

const Pet = model("pet", petSchema);

module.exports = { Pet, addSchema };
