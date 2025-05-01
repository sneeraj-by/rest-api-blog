const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    size: Number,
    mimetype: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const File = mongoose.model("file", fileSchema);
module.exports = File;
