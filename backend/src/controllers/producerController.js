const { validationResult } = require('express-validator');
const ProducerRequest = require('../models/ProducerRequest');
const ApprovedProducer = require('../models/ApprovedProducer');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { signOnboardingToken, verifyToken } = require('../services/tokenService');
const { sendMail } = require('../services/emailService');
const env = require('../config/env');

exports.getPendingProducerRequests = asyncHandler(async (req, res) => {
  const requests = await ProducerRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.json({ success: true, data: requests });
});

exports.updateProducerRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const request = await ProducerRequest.findById(req.params.id);
  if (!request) throw new ApiError(404, 'Producer request not found');

  request.status = status;
  request.adminNotes = adminNotes || '';
  await request.save();

  if (status === 'approved') {
    const token = signOnboardingToken({ producerRequestId: request._id, email: request.email, companyName: request.companyName, type: 'producer_onboarding' });
    const link = `${env.frontendUrl}/producer-onboarding?token=${token}`;

    await sendMail({
      to: request.email,
      subject: 'Adithya Supply Chain: Complete Producer Onboarding',
      html: `<p>Dear ${request.contactPerson},</p><p>Your initial request is approved. Complete onboarding here:</p><p><a href="${link}">${link}</a></p>`
    });
  }

  res.json({ success: true, data: request });
});

exports.validateOnboardingToken = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new ApiError(400, 'Token is required');

  const decoded = verifyToken(token);
  if (decoded.type !== 'producer_onboarding') throw new ApiError(400, 'Invalid onboarding token');

  res.json({ success: true, data: decoded });
});

exports.completeOnboarding = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const decoded = verifyToken(req.body.token);
  if (decoded.type !== 'producer_onboarding') throw new ApiError(400, 'Invalid onboarding token');

  const existing = await ApprovedProducer.findOne({ sourceRequestId: decoded.producerRequestId });
  if (existing) throw new ApiError(400, 'Onboarding already completed');

  const approved = await ApprovedProducer.create({
    ...req.body,
    sourceRequestId: decoded.producerRequestId
  });

  res.status(201).json({ success: true, message: 'Onboarding completed', data: approved });
});

exports.getApprovedProducers = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  const search = q ? { $or: [
    { companyName: { $regex: q, $options: 'i' } },
    { products: { $elemMatch: { $regex: q, $options: 'i' } } },
    { location: { $regex: q, $options: 'i' } }
  ] } : {};

  const producers = await ApprovedProducer.find(search).sort({ approvedAt: -1 });
  res.json({ success: true, data: producers });
});
