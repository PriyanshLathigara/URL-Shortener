const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require("bcrypt");
const session = require("express-session");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    // Hash the password with salt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ Redirect or render login page on success
    res
      .status(201)
      .render("login", { success: "Signup successful. Please log in." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = setUser(user);

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).render("home", {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      success: "Login successful!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
