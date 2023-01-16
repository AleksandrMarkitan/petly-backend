const { Pet } = require("../models/pets");

const { HttpError, ctrlWrapper } = require("../helpers");

const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { nanoid } = require("nanoid");

const avatarsDir = path.join(__dirname, "../", "public", "avatarsPet");

const add = async (req, res) => {
  const { _id: owner } = req.user;
  //-----------------Add avatar----
  const { path: tempUpload, originalname } = req.file;
  const id = nanoid();
  const filename = `${id}_${originalname}`; // подумать над именем тут біло еще + id usera - пока что сделала через наноид
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload); // тут перемещаем файл из папки temp в папку public

  const avatarURL = path.join("public", "avatarsPet", filename);

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
  //-----------------
  const result = await Pet.create({ ...req.body, owner, avatarURL });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Pet.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    message: "Pet deleted",
  });
};

module.exports = {
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
};

//   await cloudinary.v2.uploader.upload(
//     "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) {
//       console.log(result);
//     }
//   );
