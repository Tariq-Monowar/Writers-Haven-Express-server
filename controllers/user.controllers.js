require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user.models");
const Post = require("../models/post.models");

const jwt = require("jsonwebtoken");
// const nodemailer = require('nodemailer');

const getAllUsers = async (req, res) => {
  try {
    const appUser = await User.find();
    res.status(200).json(appUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// let mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "2003monowar@gmail.com",
//     pass: "xevkysjethffbccg",
//   },
// });

/**
 * POST: http://localhost:5000/users
 * @param : {
 *  "userName" : "example123",
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 *  "conformPassword": "admin123",
 *  "image": "req.files.image"
 * }
 **/
const createUser = async (req, res) => {
  let { userName, email, password, conformPassword } = req.body;
  try {
    // Check if all required fields are filled
    if (!userName || !email || !password || !conformPassword) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // userName configuration section
    userName = userName.replace(/\s+/g, " ").trim();

    // email configuration section
    const exuser = await User.findOne({ email: email });
    if (exuser) {
      return res.status(404).json({
        message: "User already exists",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }
    if (email === userName) {
      return res.status(400).json({
        message: "Email cannot be the same as your username or password",
      });
    }

    // password configuration section
    if (password !== conformPassword) {
      return res.status(400).json({
        message: "Password does not match confirm password",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be longer than 6 characters",
      });
    }
    if (password === userName || password === email) {
      return res.status(400).json({
        message: "Password cannot be the same as your username or email",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConformPassword = await bcrypt.hash(conformPassword, salt);

    // //OTP
    // const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;

    // let mailOptions = {
    //   from: "Ge@gmail.com",
    //   to: email,
    //   subject: "Testing our nodemailer",
    //   text: "This is a test email",
    //   html: `<h1>OTP: ${randomNumber}</h1>`
    // };

    // // Send email
    // mailTransporter.sendMail(mailOptions, (err) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("Message sent");
    //   }
    // });

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      conformPassword: hashedConformPassword,
    });

    if (req.files && req.files.image) {
      newUser.image = {
        data: req.files.image.data,
        contentType: req.files.image.mimetype,
      };
    }

    const token = jwt.sign(
      { userEmail: newUser.email, userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    await newUser.save();
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/**
 * PATCH: http://localhost:5000/users/:id
 * @param : {
 *  "username" : "example123",
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 *  "Cpassword": "password (auto)",
 *  "image": "req.files.image"
 * }
 **/
const updateUser = async (req, res) => {
  try {
    let { userName, email, password, conformPassword } = req.body;

    // Find the user to be updated
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // userName configuration section
    if (userName) {
      userName = userName.replace(/\s+/g, " ").trim();
      user.userName = userName;
    }

    // email configuration section
    if (email) {
      const exuser = await User.findOne({ email: email });
      if (exuser && exuser._id.toString() !== req.params.id) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }
      if (email === userName || email === password) {
        return res.status(400).json({
          message: "Email cannot be the same as your username or password",
        });
      }
      user.email = email;
    }

    // password configuration section
    if (password) {
      if (password !== conformPassword) {
        return res.status(400).json({
          message: "Password does not match conform password",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be longer than 6 characters",
        });
      }
      if (password === userName || password === email) {
        return res.status(400).json({
          message: "Password cannot be the same as your username or email",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const hashedConformPassword = await bcrypt.hash(conformPassword, salt);
      user.password = hashedPassword;
      user.conformPassword = hashedConformPassword;
    }

    if (req.files && req.files.image) {
      user.image = {
        data: req.files.image.data,
        contentType: req.files.image.mimetype,
      };
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * GET: http://localhost:5000/users/:id
 * for post reference
 **/
const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -confirmPassword');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * POST: http://localhost:5000/users/login
 * @param : {
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 * }
 **/
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password",
      });
    }

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(
        { userEmail: user.email, userId: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token, user });
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



/**
 * POST: http://localhost:5000/users/profile
 **/
const userProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userId;

      // Find the user with the given id
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


/**
 * DELETE: http://localhost:5000/users/:id
 **/
const deleteUser = async (req, res) => {
  try {
    // Find the user to be deleted
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Post.deleteMany({ postBy: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      message: "Successfully deleted user and associated posts",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getOneUser,
  loginUser,
  userProfile,
};