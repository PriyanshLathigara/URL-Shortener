const express = require("express");
const { restrictTo } = require("../middlewares/auth");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetShortId,
  handleDeleteShortId,
} = require("../controller/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", restrictTo(["NORMAL", "ADMIN"]), handleGetAnalytics);

router.get("/:shortId", handleGetShortId);

module.exports = router;
