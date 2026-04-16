const mongoose = require('mongoose');

const approvedProducerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    gstin: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    products: [{ type: String, required: true }],
    capacity: { type: String, required: true },
    certifications: [{ type: String, default: [] }],
    location: { type: String, required: true },
    remarks: { type: String, default: '' },
    approvedAt: { type: Date, default: Date.now },
    sourceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'producer_requests' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('approved_producers', approvedProducerSchema);
