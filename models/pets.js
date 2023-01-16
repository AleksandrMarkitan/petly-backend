const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const petSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    breed: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: true,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 120,
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
  date: Joi.date(), // а может регулярное віражение надо
  breed: Joi.string().min(2).max(16),
  avatarURL: Joi.string(),
  comments: Joi.string().min(8).max(120),
});

const Pet = model("pet", petSchema);

module.exports = { Pet, addSchema };
