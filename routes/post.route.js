const routes = require("express").Router();
const {
  createPost,
  deletePost,
  showAllPosts,
  updatePost,
  ownPost,
} = require("../controllers/post.controllers");

routes.post("/", createPost);
routes.get("/", showAllPosts);
routes.get("/ownpost", ownPost);
routes.delete("/:postId", deletePost);
routes.patch("/:postId", updatePost);

module.exports = routes;
