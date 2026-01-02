require("dotenv").config();

// Validate required environment variables (only exit in non-serverless environments)
const requiredEnvVars = ["MONGO_URL", "secret"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0 && !process.env.VERCEL) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\nPlease set these in your .env file before starting the server."
  );
  process.exit(1);
}

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { connectToMongoDB } = require("./connect");
const { checkForAuthorization, restrictTo } = require("./middlewares/auth");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      httpOnly: true, // Prevents XSS attacks
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(checkForAuthorization);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Connect to MongoDB (non-blocking for serverless)
// Connection will be ensured on-demand in controllers
if (process.env.MONGO_URL) {
  connectToMongoDB(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected!!"))
    .catch((err) => {
      console.error("MongoDB Connection Error:", err);
      console.error("Connection will be retried on first request");
    });
} else {
  console.warn("⚠️  MONGO_URL not set. Database operations will fail.");
}

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal server error");
});

// Export app for Vercel serverless functions
// Only listen if not in serverless environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server Started at PORT: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    if (process.env.NODE_ENV !== "production") {
      console.log(`📍 Local URL: http://localhost:${PORT}`);
    }
  });
}

// Export for Vercel
module.exports = app;
