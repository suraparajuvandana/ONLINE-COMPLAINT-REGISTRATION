const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const User = require("../models/User");
const Agent = require("../models/Agent");
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const { COMPLAINT_STATUS, NOTIFICATION_TYPES, ROLES } = require("../utils/constants");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Activate/deactivate a user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, data: user });
});

// @desc    Promote a user to agent (creates Agent profile)
// @route   POST /api/admin/agents
// @access  Private (admin)
const createAgent = asyncHandler(async (req, res) => {
  const { userId, department, specialization } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const existingAgent = await Agent.findOne({ user: userId });
  if (existingAgent) {
    return res.status(400).json({ success: false, message: "User is already an agent" });
  }

  user.role = ROLES.AGENT;
  await user.save();

  const agent = await Agent.create({ user: userId, department, specialization });

  res.status(201).json({ success: true, data: agent });
});

// @desc    Get all complaints (with optional filters)
// @route   GET /api/admin/complaints
// @access  Private (admin)
const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, category, priority } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  const complaints = await Complaint.find(filter)
    .populate("createdBy", "name email")
    .populate({ path: "assignedAgent", populate: { path: "user", select: "name email" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: complaints.length, data: complaints });
});

// @desc    Assign a complaint to an agent
// @route   PUT /api/admin/complaints/:id/assign
// @access  Private (admin)
const assignComplaint = asyncHandler(async (req, res) => {
  const { agentId } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  const agent = await Agent.findById(agentId);
  if (!agent) {
    return res.status(404).json({ success: false, message: "Agent not found" });
  }

  complaint.assignedAgent = agent._id;
  complaint.status = COMPLAINT_STATUS.IN_PROGRESS;
  complaint.statusHistory.push({
    status: COMPLAINT_STATUS.IN_PROGRESS,
    changedBy: req.user._id,
    note: `Assigned to agent ${agent._id}`,
  });

  await complaint.save();
  await Agent.findByIdAndUpdate(agent._id, { $inc: { activeComplaintsCount: 1 } });

  await Notification.create([
    {
      recipient: complaint.createdBy,
      type: NOTIFICATION_TYPES.COMPLAINT_ASSIGNED,
      title: "Complaint assigned",
      message: `Your complaint "${complaint.title}" has been assigned to an agent`,
      relatedComplaint: complaint._id,
    },
    {
      recipient: agent.user,
      type: NOTIFICATION_TYPES.COMPLAINT_ASSIGNED,
      title: "New complaint assigned to you",
      message: `You have been assigned complaint "${complaint.title}"`,
      relatedComplaint: complaint._id,
    },
  ]);

  res.json({ success: true, data: complaint });
});

// @desc    Dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalAgents, totalComplaints, statusCounts] = await Promise.all([
    User.countDocuments({ role: ROLES.USER }),
    Agent.countDocuments(),
    Complaint.countDocuments(),
    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const statusBreakdown = statusCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalUsers,
      totalAgents,
      totalComplaints,
      statusBreakdown,
    },
  });
});

module.exports = {
  getAllUsers,
  toggleUserStatus,
  createAgent,
  getAllComplaints,
  assignComplaint,
  getDashboardStats,
};
