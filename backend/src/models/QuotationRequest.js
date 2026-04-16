const mongoose = require('mongoose');

const quotationRequestSchema = new mongoose.Schema(
  {
    manufacturerRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'manufacturer_requests', required: true },
    producerId: { type: mongoose.Schema.Types.ObjectId, ref: 'approved_producers', required: true },
    itemsRequested: [{ type: String, required: true }],
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'responded', 'expired'], default: 'sent' },
    secureToken: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('quotation_requests', quotationRequestSchema);
