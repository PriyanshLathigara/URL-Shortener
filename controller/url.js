const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;
    
    // Fetch existing URLs for rendering
    const allurls = await URL.find({ createdBy: req.user._id });
    
    if (!body.url) {
      return res.render("home", { 
        urls: allurls,
        error: "URL is required" 
      });
    }
    
    // Validate URL format
    let urlToSave = body.url.trim();
    
    // Remove any leading/trailing whitespace
    if (!urlToSave) {
      return res.render("home", { 
        urls: allurls,
        error: "URL cannot be empty" 
      });
    }
    
    // If URL doesn't start with http:// or https://, add https://
    if (!urlToSave.startsWith("http://") && !urlToSave.startsWith("https://")) {
      urlToSave = "https://" + urlToSave;
    }
    
    // Very simple validation - just check minimum length
    // Let the browser handle actual URL validation when redirecting
    if (urlToSave.length < 10) { // "https://x" is minimum
      return res.render("home", { 
        urls: allurls,
        error: "URL is too short. Please enter a valid URL (e.g., example.com)" 
      });
    }
    
    // Check if this URL already exists for this user
    const existingUrl = await URL.findOne({ 
      redirectURL: urlToSave, 
      createdBy: req.user._id 
    });
    
    if (existingUrl) {
      // URL already exists, return the existing short URL
      const updatedUrls = await URL.find({ createdBy: req.user._id });
      return res.render("home", { 
        id: existingUrl.shortId, 
        urls: updatedUrls,
        info: "This URL already has a short link. Reusing existing short URL."
      });
    }
    
    // Generate unique shortId with retry logic for duplicates
    let shortID;
    let attempts = 0;
    const maxAttempts = 5;
    
    do {
      shortID = shortid();
      const existing = await URL.findOne({ shortId: shortID });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      return res.render("home", { 
        urls: allurls,
        error: "Failed to generate unique short URL. Please try again." 
      });
    }
    
    await URL.create({
      shortId: shortID,
      redirectURL: urlToSave,
      visitHistory: [],
      createdBy: req.user._id,
    });

    // Fetch all URLs for the user to display in home
    const updatedUrls = await URL.find({ createdBy: req.user._id });
    return res.render("home", { id: shortID, urls: updatedUrls });
  } catch (error) {
    console.error("Error generating short URL:", error);
    
    // Fetch URLs for error rendering
    let allurls = [];
    try {
      allurls = await URL.find({ createdBy: req.user._id });
    } catch (e) {
      // Ignore error if we can't fetch URLs
    }
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.render("home", { 
        urls: allurls,
        error: "Short URL already exists. Please try again." 
      });
    }
    return res.render("home", { 
      urls: allurls,
      error: "Internal server error. Please try again." 
    });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }
    
    // Check if user owns this URL or is an admin
    if (req.user.role !== "ADMIN" && result.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized: You don't have access to this URL's analytics" });
    }
    
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetShortId(req, res) {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!entry) {
      return res.status(404).send("URL not found");
    }

    // Validate redirectURL before redirecting
    if (!entry.redirectURL || (!entry.redirectURL.startsWith("http://") && !entry.redirectURL.startsWith("https://"))) {
      return res.status(400).send("Invalid redirect URL");
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error redirecting to URL:", error);
    return res.status(500).send("Internal server error");
  }
}

async function handleDeleteShortId(req, res) {
  try {
    const shortId = req.params.shortId;
    const deletedEntry = await URL.findOneAndDelete({ shortId });
    if (!deletedEntry) {
      return res.status(404).json({ msg: "URL not found" });
    }
    res.json({ msg: "success", deletedEntry: deletedEntry });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetShortId,
  handleDeleteShortId,
};
