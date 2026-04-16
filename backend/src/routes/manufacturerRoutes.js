const express = require('express');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { getManufacturerRequests, getMatchesForRequest } = require('../controllers/manufacturerController');

const router = express.Router();

router.get('/', protectAdmin, getManufacturerRequests);
router.get('/:id/matches', protectAdmin, getMatchesForRequest);

module.exports = router;
