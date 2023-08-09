const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/user");

// CREATE NEW USER
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    console.log("Creating a new user...");
    const user = new User({
      profilepic: req.body.profilepic,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await user.save();
    console.log("New user created:", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// LOGIN AUTHENTICATION
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    console.log("User not found.");
    return res.status(400).send("Cannot find user");
  }

  try {
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (passwordMatch) {
      const token = generateToken(user);
      console.log("Login success for user:", user.username);
      res.status(200).json({ user, token, message: "Login Success" });
    } else {
      console.log("Incorrect password for user:", user.username);
      res.status(405).send("Not Allowed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send();
  }
});

// GENERATE ACCESS TOKEN
function generateToken(user) {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);

  return token;
}

module.exports = router;
