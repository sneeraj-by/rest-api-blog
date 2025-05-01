const { File, Category, Post } = require("../model");

const addPost = async (req, res, next) => {
  try {
    const { title, desc, file, category } = req.body;
    const { _id } = req.user;
    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        res.code = 404;
        throw new Error("File not found");
      }
    }
    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      res.code = 404;
      throw new Error("Category not found");
    }

    const newPost = new Post({
      title,
      desc,
      file,
      category,
      updatedBy: _id,
    });
    await newPost.save();
    res.status(201).json({
      code: 201,
      status: true,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { title, desc, file, category } = req.body;
    const { id } = req.params;
    const { _id } = req.user;
    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        res.code = 404;
        throw new Error("File not found");
      }
    }
    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      res.code = 404;
      throw new Error("Category not found");
    }
    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }
    post.title = title ? title : post.title;
    post.desc = desc;
    post.file = file;
    post.category = category ? category : post.category;
    post.updatedBy = _id;
    await post.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const { page, size, q, category } = req.query;
    const pageNumber = parseInt(page) || 1;
    const sizeNumber = parseInt(size) || 10;
    let query = {};
    if (q) {
      const search = new RegExp(q, "i");
      query = {
        $or: [{ title: search }],
      };
    }
    if (category) {
      query = { ...query, category };
    }
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / sizeNumber);
    const posts = await Post.find(query)
      .populate("file")
      .populate("category")
      .populate("updatedBy", "-password -verificationCode -forgotPasswordCode")
      .sort({ updatedBy: -1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Posts fetched successfully",
      data: { posts, totalPages, totalPosts },
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("file")
      .populate("category")
      .populate("updatedBy", "-password -verificationCode -forgotPasswordCode");
    if (!post) {
      res.code = 404;
      throw new Error("Post not found");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
};
