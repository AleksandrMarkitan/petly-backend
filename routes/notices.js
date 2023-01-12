const { validateBody,
  //  authenticate 
  } = require("../middlewares");

const { schemas } = require("../models/notice");

const ctrl = require("../controllers/notices");

const express = require("express");
const router = express.Router();

router.get("/", 
// authenticate, 
ctrl.getAll);

router.patch(
  "/:noticeId/favorite",
  // authenticate,
  validateBody(schemas.updateNoticeFavoriteShema),
  ctrl.updateFavorite
);

module.exports = router;
