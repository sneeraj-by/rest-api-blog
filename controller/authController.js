const { User } = require("../model");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.code = 400;
      throw new Error("Email already exist");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({
      code: 201,
      status: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.code = 401;
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user);
    res.status(200).json({
      code: 200,
      status: true,
      message: "User Login successful",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (user.isVerified) {
      res.code = 400;
      throw new Error("Email already verified");
    }
    const code = generateCode(6);
    user.verificationCode = code;
    await user.save();
    //send email
    await sendEmail({
      emailTo: user.email,
      subject: "Verify your email",
      code,
      content: "Verify your account",
    });
    res.status(200).json({
      code: 200,
      status: true,
      message: "verification code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (user.isVerified) {
      res.code = 400;
      throw new Error("Email already verified");
    }
    if (user.verificationCode !== code) {
      res.code = 400;
      throw new Error("Invalid verification code");
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    const code = generateCode(6);
    user.forgotPasswordCode = code;
    await user.save();
    //send email
    await sendEmail({
      emailTo: user.email,
      subject: "Reset your password",
      code,
      content: "Reset your password",
    });
    res.status(200).json({
      code: 200,
      status: true,
      message: "Reset password code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (user.forgotPasswordCode !== code) {
      res.code = 400;
      throw new Error("Invalid verification code");
    }
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    const isPasswordValid = comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      res.code = 401;
      throw new Error("Invalid credentials");
    }
    if (oldPassword === newPassword) {
      res.code = 400;
      throw new Error("New password cannot be the same as the old password");
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email } = req.body;
    const user = await User.findById(_id).select(
      "-password -verificationCode -forgotPasswordCode"
    );
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (email) {
      const userWithEmail = await User.findOne({ email });
      if (
        userWithEmail &&
        userWithEmail.email === email &&
        String(user._id) !== String(userWithEmail._id)
      ) {
        res.code = 400;
        throw new Error("Email already exists");
      }
    }
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    if (email) {
      user.isVerified = false;
    }
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
