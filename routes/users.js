const router = require("express").Router();
const bcrypt = require("bcrypt");

const Post = require("../models/post");
const User = require("../models/user");

// Middleware to get user by ID
async function getUser(req, res , next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.user = user;
    next();
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ message: "Error getting user" });
  }
}

router.get("/:id", getUser, (req, res) => {
  res.status(200).json(res.user);
});

router.put("/:id", getUser, async (req, res) => {
  const { profilepic, username, email, password } = req.body;
  if (profilepic != null) {
    res.user.profilepic = profilepic;
  }
  if (username != null) {
    res.user.username = username;
  }
  if (email != null) {
    res.user.email = email;
  }
  if (password != null) {
    try {
      res.user.password = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Error hashing password:", err);
      res.status(500).json({ message: "Error updating password" });
      return;
    }
  }
  try {
    const updatedUser = await res.user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ message: "Error updating user" });
  }
});

router.delete("/:id", getUser, async (req, res) => {
  try {
    await Post.deleteMany({ username: res.user.username });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User was deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
