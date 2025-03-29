const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; // ✅ Đúng
const streamifier = require("streamifier");

require("dotenv").config();

// Cloudinary Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

//Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file Uploaded" });
    }
    // Function to handle the stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" }, // ✅ Đảm bảo có tham số này
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error); // Log lỗi rõ hơn
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        console.log("Stream Upload Initialized...");

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    // Call the streamUpload function
    const result = await streamUpload(req.file.buffer);
    // Respond with the uploaded image URL
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
