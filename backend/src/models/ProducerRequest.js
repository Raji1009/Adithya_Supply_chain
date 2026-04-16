const mongoose = require('mongoose');

const producerRequestSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    shortMessage: { type: String, required: true },
    productCategories: [{ type: String, required: true }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('producer_requests', producerRequestSchema);
