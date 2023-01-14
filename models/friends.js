const { Schema, model } = require("mongoose");
const friendsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    addressUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    address: {
      type: String,
    },
    workDays: {
      type: Array,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Friend = model("friend", friendsSchema);

module.exports = {
  Friend,
};
