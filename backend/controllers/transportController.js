const Transport = require('../models/Transport');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Yeni bir ulaşım teklifi veya talebi oluştur
// @route   POST /api/transport
exports.createTransport = asyncHandler(async (req, res, next) => {
    req.body.user = req.user._id || req.user.id; 
    
    const transport = await Transport.create(req.body);

    res.status(201).json({
        success: true,
        data: transport
    });
});

// @desc    Tüm ulaşım ilanlarını listele
// @route   GET /api/transport
exports.getTransportList = asyncHandler(async (req, res, next) => {
    const { type } = req.query;
    
    const filter = { status: 'active' };
    if (type) filter.type = type;

    const list = await Transport.find(filter)
        .populate('user', 'name profilePhoto')
        .sort({ departureTime: 1 });
    res.status(200).json(list);
});

// @desc    Tek bir ulaşım kaydı detayı 
// @route   GET /api/transport/:id
exports.getTransport = asyncHandler(async (req, res, next) => {
    const transport = await Transport.findById(req.params.id).populate('user', 'name profilePhoto');

    if (!transport) {
        return next(new ErrorResponse('Ulaşım kaydı bulunamadı', 404));
    }

    res.status(200).json({
        success: true,
        data: transport
    });
});

// @desc    Ulaşım kaydını güncelle 
// @route   PATCH /api/transport/:id
exports.updateTransport = asyncHandler(async (req, res, next) => {
    let transport = await Transport.findById(req.params.id);

    if (!transport) {
        return next(new ErrorResponse('Ulaşım kaydı bulunamadı', 404));
    }
    const userId = req.user._id || req.user.id;
    if (transport.user.toString() !== userId.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse('Bu işlem için yetkiniz yok', 401));
    }

    transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: transport
    });
});

// @desc    Bir ulaşım kaydını sil
// @route   DELETE /api/transport/:id
exports.deleteTransport = asyncHandler(async (req, res, next) => {
    const transport = await Transport.findById(req.params.id);

    if (!transport) {
        return next(new ErrorResponse('Ulaşım kaydı bulunamadı', 404));
    }
    
    const userId = req.user._id || req.user.id;
    if (transport.user.toString() !== userId.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse('Bu işlem için yetkiniz yok', 401));
    }

    await transport.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Kayıt başarıyla silindi'
    });
});