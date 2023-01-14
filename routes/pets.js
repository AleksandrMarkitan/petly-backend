const express = require("express");

const ctrl = require("../controllers/pets");

const { validateBody, authenticate } = require("../middlewares");

const { addSchema } = require("../models/pets");

const router = express.Router();

router.post("/", authenticate, validateBody(addSchema), ctrl.add);

router.delete("/:id", authenticate, ctrl.deleteById);

module.exports = router;
