const express = require('express');
const { body } = require('express-validator');
const { createProducerRequest, createManufacturerRequest } = require('../controllers/publicController');

const router = express.Router();

router.post('/producer-requests', [
  body('companyName').notEmpty(),
  body('contactPerson').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('shortMessage').notEmpty(),
  body('productCategories').isArray({ min: 1 })
], createProducerRequest);

router.post('/manufacturer-requests', [
  body('companyName').notEmpty(),
  body('contactPerson').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('itemsRequired').isArray({ min: 1 }),
  body('quantity').notEmpty(),
  body('specifications').notEmpty(),
  body('expectedDeliveryDate').isISO8601(),
  body('location').notEmpty()
], createManufacturerRequest);

module.exports = router;
