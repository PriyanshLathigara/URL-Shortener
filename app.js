require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const User = require("./models/user");
const { checkForAuthorization, restrictTo } = require("./middlewares/auth");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(checkForAuthorization);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected!!")
);

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
