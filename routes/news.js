const express = require('express');

const controller = require("../controllers/news");

const router = express.Router();

router.get('/', controller.getNews);

module.exports = router;
