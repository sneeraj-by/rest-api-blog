const bcryptjs = require("bcryptjs");

const comparePassword = (password, hashedPassword) => {
  return bcryptjs.compareSync(password, hashedPassword);
};

module.exports = comparePassword;
