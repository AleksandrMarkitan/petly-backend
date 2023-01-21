const express = require('express');

const controller = require("../controllers/cities");

const router = express.Router();

router.get('/', controller.getCities);

module.exports = router;