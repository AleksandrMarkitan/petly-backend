const { validateBody, authenticate, upload } = require("../middlewares");

const { schemas } = require("../models/notice");

const ctrl = require("../controllers/notices");

const express = require("express");
const router = express.Router();

// отримання оголошень авторизованого користувача доданих ним же в обрані
router.get("/favorite", authenticate, ctrl.getFavorites);

//отримання оголошень авторизованого користувача створених цим же користувачем
router.get("/owner", authenticate, ctrl.getOwner);

// отримання оголошень по категоріям
router.get("/:category", ctrl.getAll);

// отримання одного оголошення
router.get("/notice/:noticeId", ctrl.getOne);

// додавання оголошень відповідно до обраної категорії
router.post(
  "/",
  authenticate,
  upload.single("imgURL"),
  validateBody(schemas.newNoticeSchema),
  ctrl.add
);

// додавання та видалення оголошення з обраних
router.patch("/:noticeId/favorites", authenticate, ctrl.updateFavorite);

//  видалення оголошення авторизованого користувача створеного цим же користувачем
router.delete("/:noticeId", authenticate, ctrl.deleteById);

module.exports = router;
