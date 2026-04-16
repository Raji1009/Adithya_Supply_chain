const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

exports.protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const admin = await Admin.findById(decoded.id).select('-passwordHash');

  if (!admin) {
    throw new ApiError(401, 'Invalid token');
  }

  req.admin = admin;
  next();
});
