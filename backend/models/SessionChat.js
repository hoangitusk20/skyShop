const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "model"],
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const sessionChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    messages: [messageSchema],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index cho tìm kiếm nhanh
sessionChatSchema.index({ guestId: 2 });
sessionChatSchema.index({ "messages.timestamp": -1 });

const SessionChat = mongoose.model("SessionChat", sessionChatSchema);

module.exports = SessionChat;
