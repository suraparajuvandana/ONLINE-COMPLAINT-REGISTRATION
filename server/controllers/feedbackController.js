const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");
const Agent = require("../models/Agent");
const Notification = require("../models/Notification");
const { COMPLAINT_STATUS, NOTIFICATION_TYPES } = require("../utils/constants");

// @desc    Submit feedback for a resolved complaint
// @route   POST /api/feedback
// @access  Private (user)
const submitFeedback = asyncHandler(async (req, res) => {
  const { complaintId, rating, comment } = req.body;

  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  if (complaint.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only give feedback on your own complaints",
    });
  }

  if (complaint.status !== COMPLAINT_STATUS.RESOLVED) {
    return res.status(400).json({
      success: false,
      message: "Feedback can only be given for resolved complaints",
    });
  }

  const existingFeedback = await Feedback.findOne({ complaint: complaintId });
  if (existingFeedback) {
    return res.status(400).json({
      success: false,
      message: "Feedback has already been submitted for this complaint",
    });
  }

  const feedback = await Feedback.create({
    complaint: complaintId,
    submittedBy: req.user._id,
    rating,
    comment,
  });

  if (complaint.assignedAgent) {
    const agent = await Agent.findById(complaint.assignedAgent);
    if (agent) {
      const newRatingCount = (agent.resolvedComplaintsCount || 0) + 1;
      const newAverage =
        (agent.rating * (newRatingCount - 1) + rating) / newRatingCount;
      agent.rating = Math.round(newAverage * 10) / 10;
      await agent.save();

      await Notification.create({
        recipient: agent.user,
        type: NOTIFICATION_TYPES.FEEDBACK_RECEIVED,
        title: "New feedback received",
        message: `You received a ${rating}-star rating for complaint "${complaint.title}"`,
        relatedComplaint: complaint._id,
      });
    }
  }

  res.status(201).json({ success: true, data: feedback });
});

// @desc    Get feedback for a specific complaint
// @route   GET /api/feedback/:complaintId
// @access  Private
const getFeedbackByComplaint = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findOne({ complaint: req.params.complaintId }).populate(
    "submittedBy",
    "name"
  );

  if (!feedback) {
    return res.status(404).json({ success: false, message: "No feedback found" });
  }

  res.json({ success: true, data: feedback });
});

// @desc    Get all feedback (admin overview)
// @route   GET /api/feedback
// @access  Private (admin)
const getAllFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find()
    .populate("submittedBy", "name email")
    .populate("complaint", "title category")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: feedback.length, data: feedback });
});

module.exports = { submitFeedback, getFeedbackByComplaint, getAllFeedback };
