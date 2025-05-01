const { check, param } = require("express-validator");
const mongoose = require("mongoose");

const addPostValidator = [
  check("title").notEmpty().withMessage("Title is required"),

  check("file").custom(async (file) => {
    if (file & !mongoose.Types.ObjectId.isValid(file)) {
      throw new Error("Invalid File id");
    }
  }),

  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .custom(async (category) => {
      if (category && !mongoose.Types.ObjectId.isValid(category)) {
        throw new Error("Invalid Category id");
      }
    }),
];

const updatePostValidator = [
  check("file").custom(async (file) => {
    if (file & !mongoose.Types.ObjectId.isValid(file)) {
      throw new Error("Invalid File id");
    }
  }),

  check("category").custom(async (category) => {
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      throw new Error("Invalid Category id");
    }
  }),
];

const idValidator = [
  param("id").custom(async (id) => {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid post id");
    }
  }),
];
module.exports = {
  addPostValidator,
  updatePostValidator,
  idValidator,
};
