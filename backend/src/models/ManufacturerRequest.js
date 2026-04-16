const mongoose = require('mongoose');

const manufacturerRequestSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    itemsRequired: [{ type: String, required: true }],
    quantity: { type: String, required: true },
    specifications: { type: String, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    location: { type: String, required: true },
    budget: { type: Number },
    remarks: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'in_review', 'quotations_requested', 'completed'], default: 'pending' },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('manufacturer_requests', manufacturerRequestSchema);
