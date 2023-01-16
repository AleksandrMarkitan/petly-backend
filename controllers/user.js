//   этот файл Контроллер для обновления аватара пользователя.
// нужно ли в этот файл переместить:
// --обновление полей пользователя
// --вівод информации о текущем пользователе
// --и логаут
// или в хелперсе создать функцию для работы с аватаром
// вынести в хелперс функцию для обработки аватарки (если не использовать клаудинари)

const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatarsUser");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatarsUser", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  //---------convert avatar to 250-250--------
  //   await Jimp.read(resultUpload)
  //     .then((lenna) => {
  //       return lenna
  //         .resize(250, 250) // resize
  //         .writeAsync(resultUpload); // save
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  //-------------------------------
  res.json({
    avatarURL,
  });
};

module.exports = {
  //  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
