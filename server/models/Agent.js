const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    activeComplaintsCount: {
      type: Number,
      default: 0,
    },
    resolvedComplaintsCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
