const express = require("express");
const router = express.Router();
const { categoryController } = require("../controller");
const { addCategoryValidator, idValidator } = require("../validators/category");
const validate = require("../validators/validate");
const isAuth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

router.post(
  "/",
  isAuth,
  isAdmin,
  addCategoryValidator,
  validate,
  categoryController.addCategory
);

router.put(
  "/:id",
  isAuth,
  isAdmin,
  idValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  isAuth,
  isAdmin,
  idValidator,
  validate,
  categoryController.deleteCategory
);

router.get("/", isAuth, categoryController.getCategories);

router.get("/:id", isAuth, idValidator, validate, categoryController.getCategory);
module.exports = router;
