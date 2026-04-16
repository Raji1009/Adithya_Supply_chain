const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    quotationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'quotation_requests', required: true },
    producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'approved_producers', required: true },
    price: { type: Number, required: true },
    deliveryTimeline: { type: Number, required: true },
    certifications: [{ type: String, default: [] }],
    remarks: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('quotations', quotationSchema);
