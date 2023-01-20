const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const citiesSchema = new Schema({
	city: {
		type: String,
	},
	lat: {
		type: String,
	},
	lng: {
		type: String,
	},
	country: {
		type: String,
	},
	iso2: {
		type: String,
	},
	admin_name: {
		type: String,
	},
	capital: {
		type: String,
	},
	population: {
		type: String,
	},
	populpopulation_properation: {
		type: String,
	},
})

citiesSchema.post("save", handleMongooseError);

const Cities = model("city", citiesSchema);

module.exports = { Cities };