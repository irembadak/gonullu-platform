const Emergency = require('../models/Emergency');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Create emergency request
// @route   POST /api/emergencies
// @access  Private
exports.createEmergency = asyncHandler(async (req, res, next) => {
  const { emergencyType, location, description, contactNumber, peopleCount } =req.body;
  const emergency = await Emergency.create({
    emergencyType, location,
    description,
    contactNumber,
    peopleCount:parseInt(peopleCount) || 1,
    user: req.user.id,
    status: 'pending'
  });
  const io = req.app.get('io');
  if (io) {
     io.emit('newEmergency', {
      message: 'Yeni bir acil durum bildirimi alındı!',
      type:emergencyType,
      location:location.coordinates,
      id:emergency_id
     });
  }
  es.status(201).json({
    success:true,
    data:emergency
  });
});
// @desc    Get all emergencies
// @route   GET /api/emergencies
// @access  Private/Admin
exports.getEmergencies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @desc    Update emergency status
exports.updateEmergencyStatus = asyncHandler(async (req, res, next) => {
  let emergency = await Emergency.findById(req.params.id);
  if(!emergency){
    return next(new ErrorResponse('ID si ${req.params.id} olan acil durum bulunamadı',404));
  }
  emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators:true
  });
  res.status(200).json({success:true, data:emergency});
});