const express = require("express");
const router = express.Router();

// Index post
router.get("/", (req, res) => {
    res.send("GET for posts");
});

// Show post by id
router.get("/:id", (req, res) => {
    res.send("GET for show post id");
});

// Create post
router.post("/", (req, res) => {
    res.send("POST for post");
});

// Delete post
router.delete("/:id", (req, res) => {
    res.send("Delete for post id");
});

module.exports = router;
