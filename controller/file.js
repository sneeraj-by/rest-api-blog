const uploadFile = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      status: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { uploadFile };