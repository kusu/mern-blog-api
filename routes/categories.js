const router = require("express").Router();
const Category = require("../models/category");

router.post("/", async (req, res) => {
  try {
    const newCat = new Category(req.body);
    const savedCat = await newCat.save();
    res.status(201).json(savedCat);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;
