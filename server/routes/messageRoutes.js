const express = require("express");

const router = express.Router();

const {

    sendMessage,
    getMessages,
    getUnreadCount

} = require("../controllers/messageController");

// ===============================
// Send Message
// ===============================
router.post("/send", sendMessage);

// ===============================
// Get Conversation
// ===============================
router.get("/", getMessages);

// Unread Count
router.get("/unread/:user_id", getUnreadCount);

module.exports = router;