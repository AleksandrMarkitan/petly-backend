const express = require("express");

const ctrl = require("../controllers/user");

const { validateBody, authenticate, upload } = require("../middlewares");

const { addSchema } = require("../models/pets");

const router = express.Router();

//-----updateAvatar
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  ctrl.updateAvatar
);
//-------------
module.exports = router;
