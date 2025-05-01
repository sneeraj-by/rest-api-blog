const express = require("express");
const router = express.Router();
const { authController } = require("../controller");
const {
  signupValidator,
  loginValidator,
  emailValidator,
  verifyEmailValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require("../validators/auth");
const validate = require("../validators/validate");
const isAuth = require("../middlewares/auth");

router.post("/register", signupValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.post(
  "/send-verification-email",
  emailValidator,
  validate,
  authController.verifyEmail
);
router.post(
  "/verify-user",
  verifyEmailValidator,
  validate,
  authController.verifyUser
);
router.post(
  "/forgot-password",
  emailValidator,
  validate,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  authController.resetPassword
);
router.put(
  "/change-password",
  changePasswordValidator,
  validate,
  isAuth,
  authController.changePassword
);
router.put(
  "/update-profile",
  updateProfileValidator,
  validate,
  isAuth,
  authController.updateProfile
);

module.exports = router;
