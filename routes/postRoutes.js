const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const Post = require("../models/Post");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


router.post("/", upload.single("media"), async (req, res) => {
    try {
      let mediaUrl = "";
  
      //Upload media to Cloudinary (if file exists)
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "nxtkisan" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
  
        mediaUrl = uploadResult.secure_url;
      }
  
      const { userId, username, type, article, caption, userImage } = req.body;
  
      //Create new Post
      const newPost = new Post({
        userId,
        username,
        userImage: userImage || "",
        type,
        article: type === "article" ? article : "",
        mediaUrl,
        caption: type !== "article" ? caption : "",
      });
  
      //Save post in MongoDB
      await newPost.save();
  
      res.status(201).json({ success: true, message: "Post created!", post: newPost });
    } catch (error) {
      console.error("❌ Error creating post:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  });
  

module.exports = router;
