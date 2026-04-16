const express = require('express');
const { body } = require('express-validator');
const {
  getPendingProducerRequests,
  updateProducerRequestStatus,
  validateOnboardingToken,
  completeOnboarding,
  getApprovedProducers
} = require('../controllers/producerController');
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/onboarding/validate', validateOnboardingToken);
router.post('/onboarding/complete', [
  body('token').notEmpty(),
  body('companyName').notEmpty(),
  body('gstin').notEmpty(),
  body('contactPerson').notEmpty(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('address').notEmpty(),
  body('products').isArray({ min: 1 }),
  body('capacity').notEmpty(),
  body('location').notEmpty()
], completeOnboarding);

router.get('/pending', protectAdmin, getPendingProducerRequests);
router.patch('/requests/:id/status', protectAdmin, updateProducerRequestStatus);
router.get('/approved', protectAdmin, getApprovedProducers);

module.exports = router;
