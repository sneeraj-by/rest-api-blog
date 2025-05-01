const path = require("path");
const { File } = require("../model");
const { validateExtension } = require("../validators/file");
const {
  uploadFileToS3,
  fetchSignedUrl,
  deleteFileFromS3,
} = require("../utils/awsS3");

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      res.code = 400;
      throw new Error("No file selected");
    }
    const ext = path.extname(file.originalname);
    const isValid = validateExtension(ext);
    if (!isValid) {
      res.code = 400;
      throw new Error("Only .png, .jpg and .jpeg format allowed!");
    }
    const key = await uploadFileToS3({ file, ext });

    if (key) {
      const newFile = new File({
        key,
        size: file.size,
        mimetype: file.mimetype,
        createdBy: req.user._id,
      });
      await newFile.save();
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "File uploaded successfully",
      data: key,
    });
  } catch (error) {
    next(error);
  }
};

const getSignedUrl = async (req, res, next) => {
  try {
    const { key } = req.query;

    const url = await fetchSignedUrl(key);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Signed url generated successfully",
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.query;
    await deleteFileFromS3(key);
    await File.findOneAndDelete({ key });
    res.status(200).json({
      code: 200,
      status: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { uploadFile, getSignedUrl, deleteFile };
