const bcrypt = require('bcryptjs');
const connectDb = require('../config/db');
const Admin = require('../models/Admin');
const ProducerRequest = require('../models/ProducerRequest');
const ApprovedProducer = require('../models/ApprovedProducer');
const ManufacturerRequest = require('../models/ManufacturerRequest');

(async () => {
  try {
    await connectDb();

    await Promise.all([
      Admin.deleteMany({}),
      ProducerRequest.deleteMany({}),
      ApprovedProducer.deleteMany({}),
      ManufacturerRequest.deleteMany({})
    ]);

    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await Admin.create({ name: 'Adithya Admin', email: 'admin@adithya.com', passwordHash, role: 'super_admin' });

    const producerRequest = await ProducerRequest.create({
      companyName: 'SteelForge Metals',
      contactPerson: 'Karthik Rao',
      email: 'karthik@steelforge.com',
      phone: '+91-9876543210',
      shortMessage: 'We want support selling alloy steel rods.',
      productCategories: ['Steel', 'Alloys'],
      status: 'approved'
    });

    await ApprovedProducer.create({
      companyName: 'SteelForge Metals',
      gstin: '29ABCDE1234F1Z5',
      contactPerson: 'Karthik Rao',
      email: 'karthik@steelforge.com',
      phone: '+91-9876543210',
      address: 'Plot 12, Industrial Estate, Bengaluru',
      products: ['alloy steel rods', 'steel billets'],
      capacity: '500 MT/month',
      certifications: ['ISO 9001'],
      location: 'Bengaluru',
      remarks: 'Preferred for bulk orders',
      sourceRequestId: producerRequest._id
    });

    await ManufacturerRequest.create({
      companyName: 'Nova Machines Pvt Ltd',
      contactPerson: 'Shruti Menon',
      email: 'procurement@novamachines.com',
      phone: '+91-9988776655',
      itemsRequired: ['alloy steel rods'],
      quantity: '120 MT',
      specifications: 'Grade EN24, diameter 30mm',
      expectedDeliveryDate: new Date(Date.now() + 21 * 24 * 3600 * 1000),
      location: 'Chennai',
      budget: 7500000,
      remarks: 'Need phased weekly delivery',
      status: 'in_review'
    });

    console.log('Seed completed. Admin: admin@adithya.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
