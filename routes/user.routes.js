const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controllers");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/profile", UserController.userProfile);
router.get("/:id", UserController.getOneUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
