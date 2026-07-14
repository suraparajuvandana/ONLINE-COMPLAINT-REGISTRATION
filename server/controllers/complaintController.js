const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const Complaint = require("../models/Complaint");
const Agent = require("../models/Agent");
const Notification = require("../models/Notification");
const { COMPLAINT_STATUS, NOTIFICATION_TYPES, ROLES } = require("../utils/constants");

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (user)
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;

  const attachments = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

  const complaint = await Complaint.create({
    title,
    description,
    category,
    priority,
    attachments,
    createdBy: req.user._id,
    statusHistory: [
      {
        status: COMPLAINT_STATUS.PENDING,
        changedBy: req.user._id,
        note: "Complaint submitted",
      },
    ],
  });

  res.status(201).json({ success: true, data: complaint });
});

// @desc    Get complaints created by the logged-in user
// @route   GET /api/complaints/my
// @access  Private (user)
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ createdBy: req.user._id })
    .populate({ path: "assignedAgent", populate: { path: "user", select: "name email" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: complaints.length, data: complaints });
});

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private (owner, assigned agent, or admin)
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("createdBy", "name email phone")
    .populate({ path: "assignedAgent", populate: { path: "user", select: "name email" } });

  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  const isOwner = complaint.createdBy._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;
  let isAssignedAgent = false;

  if (req.user.role === ROLES.AGENT && complaint.assignedAgent) {
    const agent = await Agent.findOne({ user: req.user._id });
    isAssignedAgent =
      agent && complaint.assignedAgent._id.toString() === agent._id.toString();
  }

  if (!isOwner && !isAdmin && !isAssignedAgent) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this complaint",
    });
  }

  res.json({ success: true, data: complaint });
});

// @desc    Update complaint status/details (agent handling their assigned complaint, or admin)
// @route   PUT /api/complaints/:id
// @access  Private (agent, admin)
const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  const { status, priority, resolutionNote } = req.body;

  if (status && Object.values(COMPLAINT_STATUS).includes(status)) {
    complaint.status = status;
    complaint.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: resolutionNote || `Status changed to ${status}`,
    });

    if (status === COMPLAINT_STATUS.RESOLVED) {
      complaint.resolvedAt = new Date();

      if (complaint.assignedAgent) {
        await Agent.findByIdAndUpdate(complaint.assignedAgent, {
          $inc: { activeComplaintsCount: -1, resolvedComplaintsCount: 1 },
        });
      }
    }

    await Notification.create({
      recipient: complaint.createdBy,
      type: NOTIFICATION_TYPES.COMPLAINT_UPDATED,
      title: "Complaint status updated",
      message: `Your complaint "${complaint.title}" is now "${status}"`,
      relatedComplaint: complaint._id,
    });
  }

  if (priority) complaint.priority = priority;
  if (resolutionNote) complaint.resolutionNote = resolutionNote;

  const updated = await complaint.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete a complaint (owner before it's picked up, or admin)
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  const isOwner = complaint.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this complaint",
    });
  }

  if (isOwner && complaint.status !== COMPLAINT_STATUS.PENDING) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete a complaint that is already being processed",
    });
  }

  await complaint.deleteOne();

  res.json({ success: true, message: "Complaint deleted successfully" });
});

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
