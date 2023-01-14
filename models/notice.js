const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
// .format("DD.MM.YYYY")
const locationRegex = /^\[a-zA-Z]\,\[a-zA-Z]$/;

// const priceRegex = /^[1-9][\d]{0,7}[.\d]{0,3}$/;

// --------mongoose shema--------

const noticeSchema = new Schema(
  {
    title: { type: String, minlength: 2, maxlength: 48, required: true },
    category: {
      type: String,
      enum: ["lost/found", "in good hands", "sell"],
      required: true,
    },
    name: { type: String, minlength: 2, maxlength: 16},
    birthdate: {
      type: String,
      match: [dateRegex, "Date must be in format 22.10.2022"],
    },
    breed: { type: String, minlength: 2, maxlength: 24 },
    location: {
      type: String,
      // match: [
      //   locationRegex,
      //   "Location must be in format: City,Region (example: Brovary,Kyiv)",
      // ],
      maxlength: 50,
    },
    comments: { type: String, minlength: 8, maxlength: 120, required: true },
    price: {
      type: Number,
      min: [1, "Must be at least 1, got {VALUE}"],
      max: [10000000, "Should be no more than 10000000, got {VALUE}"],
      // required: true,
    },

    imgURL: { type: String},
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false, timestamps: true }
);

noticeSchema.post("save", handleMongooseError);

// --------Joi shemas--------


// -------Update Notice Favorite Shema-----------

const updateNoticeFavoriteShema = Joi.object({
  favorite: Joi.boolean(),
});

const schemas = {
  updateNoticeFavoriteShema,
};

const Notice = model("notice", noticeSchema);

module.exports = {
  Notice,
  schemas,
};
