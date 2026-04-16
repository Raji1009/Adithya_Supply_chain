const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const producerRoutes = require('./routes/producerRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/producers', producerRoutes);
app.use('/api/manufacturer-requests', manufacturerRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorMiddleware);

module.exports = app;
