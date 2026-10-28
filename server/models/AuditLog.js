import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    adminEmail: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetEntity: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'adminAuditLogs'
  }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
