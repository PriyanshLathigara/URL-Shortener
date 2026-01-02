const express = require("express");
const { restrictTo } = require("../middlewares/auth");
const URL = require("../models/url");

const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  try {
    const allurls = await URL.find({});
    return res.render("home", {
      urls: allurls,
    });
  } catch (error) {
    console.error("Error fetching admin URLs:", error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  try {
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("home", {
      urls: allurls,
    });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
