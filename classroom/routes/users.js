const express = require('express');
const router = express.Router();

// Index user
router.get("/", (req, res) => {
    res.send("GET for users");
});

// Show user
router.get("/:id", (req, res) => {
    res.send("GET for show users id");
});

// Post user
router.post("/", (req, res) => {
    res.send("POST for users");
});

// Delete user
router.delete("/:id", (req, res) => {
    res.send("Delete for users id");
});

module.exports = router;
