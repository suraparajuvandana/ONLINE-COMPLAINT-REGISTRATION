const ROLES = {
  USER: "user",
  ADMIN: "admin",
  AGENT: "agent",
};

const COMPLAINT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
  CLOSED: "closed",
};

const COMPLAINT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

const NOTIFICATION_TYPES = {
  COMPLAINT_CREATED: "complaint_created",
  COMPLAINT_UPDATED: "complaint_updated",
  COMPLAINT_ASSIGNED: "complaint_assigned",
  COMPLAINT_RESOLVED: "complaint_resolved",
  FEEDBACK_RECEIVED: "feedback_received",
  GENERAL: "general",
};

module.exports = {
  ROLES,
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  NOTIFICATION_TYPES,
};
