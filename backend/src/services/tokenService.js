const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.signAdminToken = (admin) => jwt.sign({ id: admin._id, role: admin.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
exports.signOnboardingToken = (payload) => jwt.sign(payload, env.jwtSecret, { expiresIn: '3d' });
exports.verifyToken = (token) => jwt.verify(token, env.jwtSecret);
