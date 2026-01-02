const jwt = require("jsonwebtoken");
const secret = process.env.secret;

function setUser(user) {
  if (!secret) {
    throw new Error("JWT secret is not configured. Please set 'secret' in .env file");
  }
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    secret
  );
}

function getUser(token) {
  if (!token) {
    return null;
  }
  if (!secret) {
    console.error("JWT secret is not configured");
    return null;
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
