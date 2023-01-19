const express = require("express");
const ctrl = require("../controllers/auth");
const { validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/logout", authenticate, ctrl.logout);

module.exports = router;
