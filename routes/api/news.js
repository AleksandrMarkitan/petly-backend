const express = require('express');

const controller = require("../../controllers/contacts");

const router = express.Router();

router.get('/news', controller.getNews)

module.exports = router;
