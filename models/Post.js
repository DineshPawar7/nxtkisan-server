const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    userImage: String,
    type: { type: String, enum: ["article", "photo", "video"] },
    article: String,
    mediaUrl: String,
    caption: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
