const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const Agent = require("../models/Agent");
const Complaint = require("../models/Complaint");

// @desc    Get logged-in agent's profile
// @route   GET /api/agents/me
// @access  Private (agent)
const getMyAgentProfile = asyncHandler(async (req, res) => {
  const agent = await Agent.findOne({ user: req.user._id }).populate(
    "user",
    "name email phone avatar"
  );

  if (!agent) {
    return res.status(404).json({ success: false, message: "Agent profile not found" });
  }

  res.json({ success: true, data: agent });
});

// @desc    Get complaints assigned to logged-in agent
// @route   GET /api/agents/complaints
// @access  Private (agent)
const getAssignedComplaints = asyncHandler(async (req, res) => {
  const agent = await Agent.findOne({ user: req.user._id });

  if (!agent) {
    return res.status(404).json({ success: false, message: "Agent profile not found" });
  }

  const { status } = req.query;
  const filter = { assignedAgent: agent._id };
  if (status) filter.status = status;

  const complaints = await Complaint.find(filter)
    .populate("createdBy", "name email phone")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: complaints.length, data: complaints });
});

// @desc    Toggle agent availability
// @route   PUT /api/agents/availability
// @access  Private (agent)
const toggleAvailability = asyncHandler(async (req, res) => {
  const agent = await Agent.findOne({ user: req.user._id });

  if (!agent) {
    return res.status(404).json({ success: false, message: "Agent profile not found" });
  }

  agent.isAvailable = !agent.isAvailable;
  await agent.save();

  res.json({ success: true, data: agent });
});

// @desc    Get all agents (for admin assignment dropdowns)
// @route   GET /api/agents
// @access  Private (admin)
const getAllAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find().populate("user", "name email phone isActive");
  res.json({ success: true, count: agents.length, data: agents });
});

module.exports = {
  getMyAgentProfile,
  getAssignedComplaints,
  toggleAvailability,
  getAllAgents,
};
