const express = require("express");
const ctrl = require("../controllers/friends");

const router = express.Router();

router.get("/", ctrl.getAll);

module.exports = router;
