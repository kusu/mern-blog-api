const router = require("express").Router();

const Post = require("../models/post");

// CREATE POST
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    console.error("Error finding post:", err);
    res.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", getPost, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      await res.post.remove();
      res.status(200).json({ message: "Deleted Post" });
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL POST
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find(req.body.title);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error getting all posts:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET POST BY PAGE
// localhost:3000/post?page=1&limit=10
router.get("/paged", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const posts = await Post.find();
    if (endIndex < posts.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.data = posts.slice(startIndex, endIndex);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error getting paged posts:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ONE SPECIFIC POST BY ID
router.get("/:id", getPost, (req, res) => {
  res.json(res.post);
});

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: `can't find data` });
    }
  } catch (err) {
    console.error("Error finding post:", err);
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

module.exports = router;
