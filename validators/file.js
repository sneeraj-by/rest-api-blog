const validateExtension = (ext) => {
  const allowedExt = [".jpg", ".jpeg", ".png"];
  return allowedExt.includes(ext);
};

module.exports = { validateExtension };
