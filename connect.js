const mongoose = require("mongoose");

// Cache the connection promise to avoid multiple connections
let cachedConnection = null;

async function connectToMongoDB(url) {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, return the cached promise
  if (cachedConnection) {
    return cachedConnection;
  }

  // Create new connection
  cachedConnection = mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  }).then(() => {
    console.log("MongoDB Connected!!");
    return mongoose.connection;
  }).catch((err) => {
    cachedConnection = null; // Reset on error
    throw err;
  });

  return cachedConnection;
}

// Ensure connection is ready before operations
async function ensureConnection(url) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    await connectToMongoDB(url);
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return false;
  }
}

module.exports = {
  connectToMongoDB,
  ensureConnection,
};
