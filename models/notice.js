const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const dateRegex = /^\d{2}\.\d{2}\d{4}$/;
const locationRegex = /^\[A-z]\,\[A-z]$/;

// --------mongoose shema--------

const noticeShema = new Schema(
  {
    title: { type: String, minlength: 2, maxlength: 48, required: true },
    category: {
      type: String,
      enum: ["lost/found", "in good hands", "sell"],
      required: true,
    },
    name: { type: String, minlength: 2, maxlength: 16},
    birthdate: {
      type: Date,
      mutch: [dateRegex, "Date must be in format 22.10.2022"],
    },
    breed: { type: String, minlength: 2, maxlength: 24 },
    location: {
      type: String,
      mutch: [
        locationRegex,
        "Location must be in format: City,Region (example: Brovary,Kyiv",
      ],
      maxlength: 50,
    },
    comments: { type: String, minlength: 8, maxlength: 120, required: true },
    price: {
      type: Number,
      min: [1, "Must be at least 1, got {VALUE}"],
      max: [10000000, "Should be no more than 10000000, got {VALUE}"],
      // required: true,
    },

    favorite: { type: Boolean, default: false },
    // owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false, timestamps: true }
);

noticeShema.post("save", handleMongooseError);

// --------Joi shemas--------


// -------Update Notice Favorite Shema-----------

const updateNoticeFavoriteShema = Joi.object({
  favorite: Joi.boolean(),
});

const schemas = {
  updateNoticeFavoriteShema,
};

const Notice = model("notice", noticeShema);

module.exports = {
  Notice,
  schemas,
};
