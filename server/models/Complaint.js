const mongoose = require("mongoose");
const { COMPLAINT_STATUS, COMPLAINT_PRIORITY } = require("../utils/constants");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(COMPLAINT_STATUS),
      default: COMPLAINT_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(COMPLAINT_PRIORITY),
      default: COMPLAINT_PRIORITY.MEDIUM,
    },
    attachments: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    resolutionNote: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(COMPLAINT_STATUS),
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

complaintSchema.index({ createdBy: 1, status: 1 });

module.exports = mongoose.model("Complaint", complaintSchema);
