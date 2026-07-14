const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getFeedbackByComplaint,
  getAllFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  validate,
  feedbackValidationRules,
} = require("../middleware/validationMiddleware");
const { ROLES } = require("../utils/constants");

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.USER),
  feedbackValidationRules,
  validate,
  submitFeedback
);
router.get("/", protect, authorizeRoles(ROLES.ADMIN), getAllFeedback);
router.get("/:complaintId", protect, getFeedbackByComplaint);

module.exports = router;
