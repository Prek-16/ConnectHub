const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Database Connection
require("./config/db");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const followRoutes = require("./routes/followRoutes");
const userRoutes=require("./routes/userRoutes");
const savePostRoutes = require("./routes/savePostRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/users",userRoutes);
app.use("/api/saved", savePostRoutes);
app.use("/api/messages", messageRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("🚀 ConnectHub Backend is Running Successfully...");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});