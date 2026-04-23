const express = require("express");
const router = express.Router();
const Grievance = require("../models/Grievance");
const auth = require("../middleware/auth");

// POST /api/grievances → Submit grievance
router.post("/", auth, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const grievance = new Grievance({
      studentId: req.student.id,
      title,
      description,
      category,
    });
    await grievance.save();
    res.status(201).json({ message: "Grievance submitted", grievance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/grievances → View all grievances
router.get("/", auth, async (req, res) => {
  try {
    // Search by title if query param exists
    const filter = { studentId: req.student.id };
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }
    const grievances = await Grievance.find(filter).sort({ date: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/grievances/:id → View grievance by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const grievance = await Grievance.findOne({
      _id: req.params.id,
      studentId: req.student.id,
    });
    if (!grievance)
      return res.status(404).json({ message: "Grievance not found" });
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/grievances/:id → Update grievance
router.put("/:id", auth, async (req, res) => {
  const { title, description, category, status } = req.body;
  try {
    const grievance = await Grievance.findOneAndUpdate(
      { _id: req.params.id, studentId: req.student.id },
      { title, description, category, status },
      { new: true },
    );
    if (!grievance)
      return res.status(404).json({ message: "Grievance not found" });
    res.json({ message: "Updated successfully", grievance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/grievances/:id → Delete grievance
router.delete("/:id", auth, async (req, res) => {
  try {
    const grievance = await Grievance.findOneAndDelete({
      _id: req.params.id,
      studentId: req.student.id,
    });
    if (!grievance)
      return res.status(404).json({ message: "Grievance not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
