const express = require('express');
const { body } = require('express-validator');
const {
  sendQuotationRequests,
  getQuotationRequestByToken,
  submitQuotation,
  getComparisonByManufacturerRequest
} = require('../controllers/quotationController');
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/request-by-token', getQuotationRequestByToken);
router.post('/submit', [
  body('token').notEmpty(),
  body('price').isNumeric(),
  body('deliveryTimeline').isNumeric()
], submitQuotation);

router.post('/send', protectAdmin, [
  body('manufacturerRequestId').notEmpty(),
  body('producerIds').isArray({ min: 1 }),
  body('itemsRequested').isArray({ min: 1 })
], sendQuotationRequests);

router.get('/comparison/:id', protectAdmin, getComparisonByManufacturerRequest);

module.exports = router;
