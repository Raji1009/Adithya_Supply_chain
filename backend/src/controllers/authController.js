const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { signAdminToken } = require('../services/tokenService');

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);

  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new ApiError(401, 'Invalid credentials');

  const matched = await bcrypt.compare(password, admin.passwordHash);
  if (!matched) throw new ApiError(401, 'Invalid credentials');

  const token = signAdminToken(admin);
  res.json({ success: true, data: { token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } } });
});
