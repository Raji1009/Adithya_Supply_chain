const crypto = require('crypto');
const { validationResult } = require('express-validator');
const QuotationRequest = require('../models/QuotationRequest');
const Quotation = require('../models/Quotation');
const ApprovedProducer = require('../models/ApprovedProducer');
const ManufacturerRequest = require('../models/ManufacturerRequest');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendMail } = require('../services/emailService');
const env = require('../config/env');

exports.sendQuotationRequests = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const { manufacturerRequestId, producerIds, itemsRequested } = req.body;
  const manufacturerRequest = await ManufacturerRequest.findById(manufacturerRequestId);
  if (!manufacturerRequest) throw new ApiError(404, 'Manufacturer request not found');

  const records = [];
  for (const producerId of producerIds) {
    const producer = await ApprovedProducer.findById(producerId);
    if (!producer) continue;

    const token = crypto.randomBytes(24).toString('hex');
    const record = await QuotationRequest.create({ manufacturerRequestId, producerId, itemsRequested, secureToken: token });
    records.push(record);

    const quoteLink = `${env.frontendUrl}/quotation-submit?token=${token}`;
    await sendMail({
      to: producer.email,
      subject: 'Adithya Supply Chain: Quotation Request',
      html: `<p>Dear ${producer.contactPerson},</p><p>Please submit your quotation:</p><p><a href="${quoteLink}">${quoteLink}</a></p>`
    });
  }

  manufacturerRequest.status = 'quotations_requested';
  await manufacturerRequest.save();

  res.status(201).json({ success: true, data: records });
});

exports.getQuotationRequestByToken = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const quotationRequest = await QuotationRequest.findOne({ secureToken: token })
    .populate('producerId')
    .populate('manufacturerRequestId');

  if (!quotationRequest) throw new ApiError(404, 'Invalid quotation link');
  res.json({ success: true, data: quotationRequest });
});

exports.submitQuotation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const { token, price, deliveryTimeline, certifications, remarks } = req.body;
  const quotationRequest = await QuotationRequest.findOne({ secureToken: token });
  if (!quotationRequest) throw new ApiError(404, 'Invalid quotation request token');

  const existing = await Quotation.findOne({ quotationRequestId: quotationRequest._id });
  if (existing) throw new ApiError(400, 'Quotation already submitted');

  const quotation = await Quotation.create({
    quotationRequestId: quotationRequest._id,
    producerId: quotationRequest.producerId,
    price,
    deliveryTimeline,
    certifications,
    remarks
  });

  quotationRequest.status = 'responded';
  await quotationRequest.save();

  res.status(201).json({ success: true, data: quotation });
});

exports.getComparisonByManufacturerRequest = asyncHandler(async (req, res) => {
  const quotationRequests = await QuotationRequest.find({ manufacturerRequestId: req.params.id }).populate('producerId');
  const ids = quotationRequests.map((q) => q._id);
  const quotations = await Quotation.find({ quotationRequestId: { $in: ids } }).populate('producerId');

  const lowestPrice = quotations.length ? Math.min(...quotations.map((q) => q.price)) : null;
  const bestDelivery = quotations.length ? Math.min(...quotations.map((q) => q.deliveryTimeline)) : null;

  const comparison = quotations.map((q) => ({
    quotationId: q._id,
    producerName: q.producerId.companyName,
    price: q.price,
    deliveryTimeline: q.deliveryTimeline,
    certifications: q.certifications,
    location: q.producerId.location,
    remarks: q.remarks,
    isLowestQuote: q.price === lowestPrice,
    isBestDelivery: q.deliveryTimeline === bestDelivery,
    score: q.price + q.deliveryTimeline
  }));

  const bestOverallScore = comparison.length ? Math.min(...comparison.map((x) => x.score)) : null;

  res.json({
    success: true,
    data: comparison.map((item) => ({ ...item, isBestOverall: item.score === bestOverallScore }))
  });
});
