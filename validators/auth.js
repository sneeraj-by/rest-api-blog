const { check } = require("express-validator");
const mongoose = require("mongoose");
const validateEmail = require("./validateEmail");

const signupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
];

const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email is required"),
];

const verifyEmailValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email is required"),
  check("code").notEmpty().withMessage("Code is required"),
];

const resetPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .notEmpty()
    .withMessage("Email is required"),
  check("code").notEmpty().withMessage("Code is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
];

const changePasswordValidator = [
  check("oldPassword").notEmpty().withMessage("Old password is required"),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
];

const updateProfileValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").custom(async (email) => {
    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        throw new Error("Invalid email");
      }
    }
  }),
  check("profilePic").custom(async (profilePic) => {
    if (profilePic && !mongoose.Types.ObjectId.isValid(profilePic)) {
      throw new Error("Invalid profile picture URL");
    }
  }),
];

module.exports = {
  signupValidator,
  loginValidator,
  emailValidator,
  verifyEmailValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
};
