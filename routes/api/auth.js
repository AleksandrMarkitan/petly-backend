const express = require("express");

const ctrl = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/users/signup", validateBody(schemas.signupSchema), ctrl.signup);
router.post("/users/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/users/verify/:verificationToken", ctrl.verify);
router.post(
  "/users/verify",
  validateBody(schemas.verifyEmailSchema),
  ctrl.resendVerifyEmail
);
router.get("/users/current", authenticate, ctrl.getCurrent);
router.get("/users/logout", authenticate, ctrl.logout);
router.patch(
  "/users",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscription
);
router.patch(
  "/users/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
