const express = require("express");
const router = express.Router();
// const { getRelatedProducts } = require("../controller/chat");
const { getResponse } = require("../services/geminiService");
const SessionChat = require("../models/SessionChat");
const { Pinecone } = require("@pinecone-database/pinecone");
const { protectUser } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.Index("dense-index").namespace("example-namespace");

async function getRelatedProducts(message) {
  // console.log(index);
  const results = await index.searchRecords({
    query: {
      topK: 5,
      inputs: { text: message },
    },
  });

  const relatedProducts = results.result.hits.map((hit) => {
    return `id: ${hit._id}, text: ${hit.fields.chunk_text}`;
  });
  // console.log("Related products: ", results);
  return relatedProducts;
}

// Get chat history - supports both user and guest sessions
router.get("/history", protectUser, async (req, res) => {
  try {
    const user = req.user?._id;
    const { guestId } = req.query;
    let session;

    if (user) {
      session = await SessionChat.findOne({ user });
    } else if (guestId) {
      session = await SessionChat.findOne({ guestId });
    }

    // If no session found, return empty messages instead of 404
    if (!session) {
      return res.json({
        success: true,
        messages: [],
        guestId: guestId || null,
      });
    }

    res.json({
      success: true,
      messages: session.messages,
      guestId: session.guestId,
    });
  } catch (error) {
    console.error("Error getting chat history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Send a new message - supports both user and guest sessions
router.post("/message", protectUser, async (req, res) => {
  try {
    const user = req.user?._id;
    const { guestId, message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let session;

    // Nếu có userId, tìm session cho người dùng
    if (user) {
      session = await SessionChat.findOne({ user: user });

      // Kiểm tra userId đó đã từng chat chưa, nếu có thì update nếu không thì tạo mới
      if (session) {
        // Update lastActivity
        session.lastActivity = new Date();
      } else {
        session = await SessionChat.create({
          user: user,
          guestId: `guest_${Date.now()}`,
          messages: [],
          lastActivity: new Date(),
        });
      }
    }
    // Xử lý guest
    else if (guestId) {
      session = await SessionChat.findOne({ guestId });

      // Nếu tìm ko ra thì tạo mới
      if (!session) {
        const newGuestId = guestId;
        session = await SessionChat.create({
          guestId: newGuestId,
          messages: [],
          lastActivity: new Date(),
        });
      }
    }
    // Nếu không cung cấp cả 2, tạo mới guest
    else {
      const newGuestId = `guest_${Date.now()}`;
      session = await SessionChat.create({
        guestId: newGuestId,
        messages: [],
        lastActivity: new Date(),
      });
    }

    // Lưu tin nhắn của người dùng

    // Giới hạn số lượng tin nhắn (20 tin nhắn gần nhất)
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }

    // Cập nhật thời gian hoạt động cuối cùng
    session.lastActivity = new Date();
    await session.save();

    // Tìm sản phẩm liên quan
    const relatedProducts = await getRelatedProducts(message);

    // Chuyển đổi history messages sang định dạng của Gemini
    let history = session.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    if (history.length > 10) {
      history = history.slice(-10);
    }

    // Lấy phản hồi từ Gemini
    const response = await getResponse({
      message,
      history,
      products: relatedProducts,
    });

    // Lưu phản hồi vào database
    let botMessage = {
      content: response,
      role: "model",
      timestamp: new Date(),
    };
    let userMessage = {
      content: message,
      role: "user",
      timestamp: new Date(),
    };
    session.messages.push(userMessage);
    session.messages.push(botMessage);
    await session.save();

    // Gửi phản hồi về client
    res.json({
      success: true,
      message: [userMessage, botMessage],
      guestId: session.guestId,
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
