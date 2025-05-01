const multer = require("multer");
const path = require("path");
const generateCode = require("../utils/generateCode");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    const extension = path.extname(originalname);
    const fileName = originalname
      .replace(extension, "")
      .split(" ")
      .join("_")
      .toLocaleLowerCase();
    const code = generateCode(12);
    cb(null, `${fileName}_${code}${extension}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const mimeType = file.mimetype;
    if (
      mimeType === "image/jpeg" ||
      mimeType === "image/png" ||
      mimeType === "image/jpg" ||
      mimeType === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .jpeg and pdf format allowed!"));
    }
  },
});

module.exports = upload;
