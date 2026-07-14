const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  validate,
  registerValidationRules,
  loginValidationRules,
} = require("../middleware/validationMiddleware");

router.post("/register", registerValidationRules, validate, registerUser);
router.post("/login", loginValidationRules, validate, loginUser);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
