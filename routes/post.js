const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/auth");
const { postController } = require("../controller");
const {
  addPostValidator,
  updatePostValidator,
  idValidator,
} = require("../validators/post");
const validate = require("../validators/validate");

router.post(
  "/add-post",
  isAuth,
  addPostValidator,
  validate,
  postController.addPost
);
router.put(
  "/:id",
  isAuth,
  updatePostValidator,
  idValidator,
  validate,
  postController.updatePost
);

router.delete("/:id", isAuth, idValidator, postController.deletePost);

router.get("/", isAuth, postController.getAllPosts);
router.get("/:id", isAuth, idValidator, postController.getPostById);
module.exports = router;
