require("dotenv").config();
const User = require("../models/user.models");
const Post = require("../models/post.models");
const jwt = require("jsonwebtoken");

/**
 * POST: http://localhost:5000/post
 * @param : {
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 * }
 **/
const createPost = async (req, res) => {
  try {
    const { bookName, writer, descriptions } = req.body;

    // Retrieve the user ID from the token
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Find the user who created the post
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new post and assign the postBy field with the user ID
    const newPost = new Post({
      bookName,
      writer,
      descriptions,
      postBy: user._id,
    });

    if (req.files && req.files.image) {
      newPost.image = {
        data: req.files.image.data,
        contentType: req.files.image.mimetype,
      };
    }
    const savedPost = await newPost.save();

    res.status(200).json({ post: savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { bookName, writer, descriptions } = req.body;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Retrieve the user ID from the token
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Check if the authenticated user is the one who created the post
    if (post.postBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    // Update the post fields if they are provided in the request body
    if (bookName) {
      post.bookName = bookName;
    }
    if (writer) {
      post.writer = writer;
    }
    if (descriptions) {
      post.descriptions = descriptions;
    }

    if (req.files && req.files.image) {
      post.image = {
        data: req.files.image.data,
        contentType: req.files.image.mimetype,
      };
    }

    const updatedPost = await post.save();

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    res.status(500).json({ error });
  }
};

/**
 * get: http://localhost:5000/post
 * @param : {
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 * }
 **/
// const showAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find();
//     const postIds = posts.map(post => post.postBy);
//     const users = await User.find({ _id: { $in: postIds } }).select('-password -conformPassword');

//     const responseData = {
//       posts: posts.map(post => {
//         const user = users.find(user => user._id.toString() === post.postBy.toString());
//         return { ...post._doc, user };
//       })
//     };

//     res.status(200).json(responseData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const showAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "postBy",
      "-password -conformPassword"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ownPost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Find all posts where postBy matches the authenticated user's ID
    const posts = await Post.find({ postBy: userId }).populate(
      "postBy",
      "-password -conformPassword"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST: http://localhost:5000/users/login
 * @param : {
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 * }
 **/
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Retrieve the user ID from the token
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Check if the authenticated user is the one who created the post
    if (post.postBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { createPost, deletePost, showAllPosts, updatePost, ownPost };
