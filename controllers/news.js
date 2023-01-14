const { News } = require('../models/news');

const { HttpError, ctrlWrapper } = require("../helpers");

const getNews = async (req, res) => {
	const { page = 1, limit = 6 } = req.query;
	const skip = (page - 1) * limit;

	const result = await News.find({}, "", { skip, limit });

	if (!result) {
		throw HttpError(404)
	}

	res.status(200).json(result);
}

module.exports = {
	getNews: ctrlWrapper(getNews),
}