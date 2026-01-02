const User = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require("bcrypt");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).send("Name, email, and password are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long");
    }

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
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // ✅ Redirect or render login page on success
    res
      .status(201)
      .render("login", { success: "Signup successful. Please log in." });
  } catch (err) {
    console.error(err);
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).send("User already exists with this email");
    }
    res.status(500).send("Internal Server Error");
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = setUser(user);

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // CSRF protection
    });

    // Fetch user's URLs after login
    const URL = require("../models/url");
    const allurls = await URL.find({ createdBy: user._id });
    
    res.status(200).render("home", {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      urls: allurls,
      success: "Login successful!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
}

async function handleUserLogout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
