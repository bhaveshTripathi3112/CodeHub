import {DiscussionPost} from "../models/discussion.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await DiscussionPost.create({
      title,
      content,
      userId: req.result._id,
    });

    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await DiscussionPost.find()
      .populate("userId", "firstName lastName")
      .populate("comments.userId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await DiscussionPost.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Add the new comment
    post.comments.push({
      userId: req.result._id, // from user middleware
      content,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};