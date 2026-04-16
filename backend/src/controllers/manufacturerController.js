const ManufacturerRequest = require('../models/ManufacturerRequest');
const ApprovedProducer = require('../models/ApprovedProducer');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

exports.getManufacturerRequests = asyncHandler(async (req, res) => {
  const requests = await ManufacturerRequest.find().sort({ createdAt: -1 });
  res.json({ success: true, data: requests });
});

exports.getMatchesForRequest = asyncHandler(async (req, res) => {
  const manufacturerRequest = await ManufacturerRequest.findById(req.params.id);
  if (!manufacturerRequest) throw new ApiError(404, 'Manufacturer request not found');

  const items = manufacturerRequest.itemsRequired.map((i) => i.toLowerCase());
  const producers = await ApprovedProducer.find();

  const matches = producers
    .map((producer) => {
      const searchable = [...producer.products, ...producer.certifications].join(' ').toLowerCase();
      const score = items.reduce((acc, item) => (searchable.includes(item) ? acc + 1 : acc), 0);
      return {
        producer,
        score,
        matchedItems: manufacturerRequest.itemsRequired.filter((item) => searchable.includes(item.toLowerCase()))
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  res.json({ success: true, data: { manufacturerRequest, matches } });
});
