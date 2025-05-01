const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const {
  authRoutes,
  categoryRoutes,
  fileRoutes,
  postRoutes,
} = require("./routes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const notfound = require("./controller/notFound");

// init app
const app = express();

//connect db
connectDB();

// 3rd party middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/posts", postRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ code: 200, status: true, message: "Server is running." });
});

// not found route
app.use(notfound);

// error handling middleware
app.use(errorHandler);

module.exports = app;
