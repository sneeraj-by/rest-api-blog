const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const { fileController } = require("../controller");
const upload = require("../middlewares/upload");

router.post(
  "/upload",
  isAuth,
  upload.single("image"),
  fileController.uploadFile
);

module.exports = router;
