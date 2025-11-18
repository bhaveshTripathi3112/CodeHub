import React, { useEffect, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import Toast from "../components/Toaster";
import { motion, AnimatePresence } from "framer-motion";

export default function DiscussionPage() {
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loadingPosts, setLoadingPosts] = useState(true);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await axiosClient.get("/discussion/all");
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
      showToast("Failed to load discussions", "error");
    } finally {
      setLoadingPosts(false);
    }
  };

  // Create discussion post
  const createPost = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      return showToast("Title and content cannot be empty!", "error");
    }

    try {
      await axiosClient.post("/discussion/create", form);

      setForm({ title: "", content: "" });
      showToast("Post added successfully!", "success");

      fetchPosts();
    } catch (err) {
      showToast(err.response?.data?.message || "Error creating post", "error");
    }
  };

  // Add comment to a post
  const addComment = async (postId, comment) => {
    if (!comment.trim()) return;

    try {
      await axiosClient.post(`/discussion/${postId}/comment`, {
        content: comment.trim(),
      });
      fetchPosts(); // Auto-refresh comment list
    } catch (err) {
      console.error(err);
      showToast("Failed to post comment", "error");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-10">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
        Community Discussions
      </h1>

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/60 p-6 rounded-xl shadow-lg border border-gray-700 max-w-3xl mx-auto"
      >
        <input
          type="text"
          placeholder="Post Title..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 mb-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />

        <textarea
          placeholder="Share your thoughts..."
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
        />

        <button
          onClick={createPost}
          className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-medium"
        >
          Create Post
        </button>
      </motion.div>

      {/* Posts List */}
      <div className="mt-12 space-y-8 max-w-3xl mx-auto">
        {loadingPosts ? (
          <p className="text-center text-gray-400">Loading discussions...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No discussions yet. Start one!</p>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-lg"
            >
              {/* Post Title */}
              <h2 className="text-2xl font-bold text-blue-400">{post.title}</h2>

              {/* Post content */}
              <p className="mt-2 text-gray-300 whitespace-pre-line">{post.content}</p>

              <p className="text-sm text-gray-500 mt-2">
                Posted by <span className="text-gray-300">{post.userId?.firstName}</span>
              </p>

              {/* Comments Section */}
              <div className="mt-5 pl-4 border-l-2 border-gray-700 space-y-3">
                {post.comments.length === 0 ? (
                  <p className="text-gray-500">No comments yet.</p>
                ) : (
                  post.comments.map((c, idx) => (
                    <div key={idx} className="text-gray-300">
                      <strong className="text-blue-300">{c.userId?.firstName}: </strong>
                      {c.content}
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Box */}
              <AddCommentBox postId={post._id} addComment={addComment} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function AddCommentBox({ postId, addComment }) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!comment.trim()) return;
    setSending(true);

    await addComment(postId, comment);
    setComment("");

    setSending(false);
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
      />

      <button
        onClick={handleSend}
        disabled={sending}
        className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg disabled:bg-gray-700"
      >
        {sending ? "Posting..." : "Reply"}
      </button>
    </div>
  );
}
