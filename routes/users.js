const express = require("express");
const ctrl = require("../controllers/users");
const { authenticate, upload } = require("../middlewares");

const router = express.Router();

router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
  "/update",
  authenticate,
  upload.single("avatarURL"),
  ctrl.updateUserData
);

module.exports = router;
