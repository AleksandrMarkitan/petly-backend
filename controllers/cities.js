const { Cities } = require('../models/cities');

const { HttpError, ctrlWrapper } = require("../helpers");

const getCities = async (req, res) => {
	const result = await Cities.find();
	console.log(result);

	if (!result) {
		throw HttpError(404)
	}

	res.status(200).json(result);
}

module.exports = {
	getCities: ctrlWrapper(getCities),
}