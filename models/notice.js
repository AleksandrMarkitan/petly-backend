const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const DATE_REGEXP = /^\d{2}\.\d{2}\.\d{4}$/;
// .format("DD.MM.YYYY")
const LOCALTION_REGEXP = /^\s*(?:\w+\s*,\s*)(?:\w+\s*)$/;
const PRICE_REGEXP = /^[1-9][\d]{0,7}[.\d]{0,3}$/;

// --------mongoose shema--------

const noticeSchema = new Schema(
  {
    title: { type: String, minlength: 2, maxlength: 48, required: true },
    category: {
      type: String,
      enum: ["lost-found", "in-good-hands", "sell"],
      required: true,
    },
    name: { type: String, minlength: 2, maxlength: 16 },
    birthdate: {
      type: String,
      match: [DATE_REGEXP, "Date must be in format 22.10.2022"],
    },
    breed: { type: String, minlength: 2, maxlength: 24 },
    location: {
      type: String,
      match: [
        LOCALTION_REGEXP,
        "Location must be in format: City,Region (example: Brovary,Kyiv)",
      ],
      maxlength: 50,
    },
    comments: { type: String, minlength: 8, maxlength: 120, required: true },
    price: {
      type: Number,
      match: [PRICE_REGEXP],
      // min: [1, "Must be at least 1, got {VALUE}"],
      // max: [10000000, "Should be no more than 10000000, got {VALUE}"],
    },

    imgURL: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false, timestamps: true }
);

noticeSchema.post("save", handleMongooseError);

// --------Joi shemas--------
const newNoticeSchema = Joi.object({
  title: Joi.string().min(2).max(48).required(),
  category: Joi.string()
    .valid("lost-found", "in-good-hands", "sell")
    .required(),
  name: Joi.string().min(2).max(16).required(),
  birthdate: Joi.date().greater('1-1-1990').less('now'),
  breed: Joi.string().min(2).max(24),
  location: Joi.string().pattern(LOCALTION_REGEXP).max(50),
  comments: Joi.string().min(8).max(120).required(),
  price: Joi.number().integer().min(1).max(10000000),
  favorite: Joi.boolean(),
});

const schemas = {
  newNoticeSchema,
};

const Notice = model("notice", noticeSchema);

module.exports = {
  Notice,
  schemas,
};