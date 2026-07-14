const express = require("express");
const router = express.Router();
const {
  getMyAgentProfile,
  getAssignedComplaints,
  toggleAvailability,
  getAllAgents,
} = require("../controllers/agentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

router.get("/", protect, authorizeRoles(ROLES.ADMIN), getAllAgents);
router.get("/me", protect, authorizeRoles(ROLES.AGENT), getMyAgentProfile);
router.get(
  "/complaints",
  protect,
  authorizeRoles(ROLES.AGENT),
  getAssignedComplaints
);
router.put(
  "/availability",
  protect,
  authorizeRoles(ROLES.AGENT),
  toggleAvailability
);

module.exports = router;
