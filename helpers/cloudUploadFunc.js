const cloudinary = require("./cloudinary");

const fs = require("fs/promises");

const dafaultImgURL =
	"http://res.cloudinary.com/digml0rat/image/upload/v1673906206/Fullstack%20Group%20Project/home-pets_hywfgq.png";

const optionsNotices = {
	use_filename: true,
	unique_filename: true,
	overwrite: true,
	transformation: [{ width: 336, height: 336, gravity: "auto", crop: "fill" }],
};

const optionsAvatar = {
	use_filename: true,
	unique_filename: true,
	overwrite: true,
	transformation: [{ width: 233, height: 233, gravity: "face", crop: "thumb" }],
};

const optionsPet = {
	use_filename: true,
	unique_filename: true,
	overwrite: true,
	transformation: [{ width: 240, height: 240, gravity: "auto", crop: "fill" }],
};

// завантаження зображення у хмару
// оберить тип опцій для передачі другим параметром uploadType "avatar" чи "pet"

const uploadImg = async (tempUpload, uploadType) => {
	let options = null;
	if (uploadType === "avatar") {
		options = optionsAvatar;
	} else if (uploadType === "pet") {
		options = optionsPet;
	} else {
		options = optionsNotices;
	}

	if (tempUpload) {
		const upload = await cloudinary.uploader.upload(tempUpload, options);

		// видаляємо з папки temp
		await fs.unlink(tempUpload);

		return upload.secure_url;
	}
	return dafaultImgURL;
};

module.exports = uploadImg;
