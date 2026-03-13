const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    animalType: { type: String, required: true },
    location: { type: String, required: true },
    urgency: { type: String, default: "Medium" },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ["open", "in-progress", "rescued"], default: "open" },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);