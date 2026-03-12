const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const authMiddleware = require("../middleware/auth");

// POST — submit a new report
router.post("/", authMiddleware, async (req, res) => {
    try {
        const report = new Report({ ...req.body, reportedBy: req.user.id });
        await report.save();
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET — all reports (admin)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const reports = await Report.find().populate("reportedBy", "name email").populate("assignedTo", "name");
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET — reports by logged in citizen
router.get("/mine", authMiddleware, async (req, res) => {
    try {
        const reports = await Report.find({ reportedBy: req.user.id });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH — update report status
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;