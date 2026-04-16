const express = require('express');
const { protectAdmin } = require('../middlewares/authMiddleware');
const ProducerRequest = require('../models/ProducerRequest');
const ApprovedProducer = require('../models/ApprovedProducer');
const ManufacturerRequest = require('../models/ManufacturerRequest');
const QuotationRequest = require('../models/QuotationRequest');
const Quotation = require('../models/Quotation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/summary', protectAdmin, asyncHandler(async (req, res) => {
  const [pendingProducerRequests, approvedProducers, manufacturerRequests, pendingQuotationRequests, quotationsReceived] = await Promise.all([
    ProducerRequest.countDocuments({ status: 'pending' }),
    ApprovedProducer.countDocuments(),
    ManufacturerRequest.countDocuments(),
    QuotationRequest.countDocuments({ status: 'sent' }),
    Quotation.countDocuments()
  ]);

  res.json({
    success: true,
    data: { pendingProducerRequests, approvedProducers, manufacturerRequests, pendingQuotationRequests, quotationsReceived }
  });
}));

module.exports = router;
