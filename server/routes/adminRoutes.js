const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleUserStatus,
  createAgent,
  getAllComplaints,
  assignComplaint,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");

router.use(protect, authorizeRoles(ROLES.ADMIN));

router.get("/users", getAllUsers);
router.put("/users/:id/status", toggleUserStatus);
router.post("/agents", createAgent);
router.get("/complaints", getAllComplaints);
router.put("/complaints/:id/assign", assignComplaint);
router.get("/stats", getDashboardStats);

module.exports = router;
