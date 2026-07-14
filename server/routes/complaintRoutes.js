const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  validate,
  complaintValidationRules,
} = require("../middleware/validationMiddleware");
const { ROLES } = require("../utils/constants");

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.USER),
  upload.array("attachments", 5),
  complaintValidationRules,
  validate,
  createComplaint
);

router.get("/my", protect, authorizeRoles(ROLES.USER), getMyComplaints);

router
  .route("/:id")
  .get(protect, getComplaintById)
  .put(protect, authorizeRoles(ROLES.AGENT, ROLES.ADMIN), updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;
