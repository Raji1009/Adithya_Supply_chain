const { validationResult } = require('express-validator');
const ProducerRequest = require('../models/ProducerRequest');
const ManufacturerRequest = require('../models/ManufacturerRequest');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

exports.createProducerRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const payload = { ...req.body, productCategories: req.body.productCategories || [] };
  const producerRequest = await ProducerRequest.create(payload);
  res.status(201).json({ success: true, message: 'Producer request submitted successfully', data: producerRequest });
});

exports.createManufacturerRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const request = await ManufacturerRequest.create(req.body);
  res.status(201).json({ success: true, message: 'Manufacturer requirement submitted successfully', data: request });
});
