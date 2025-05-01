const { check, param } = require("express-validator");
const { default: mongoose } = require("mongoose");

const addCategoryValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
];
const idValidator = [
  param("id").custom(async (id) => {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category id.");
    }
  }),
];

module.exports = { addCategoryValidator, idValidator };
