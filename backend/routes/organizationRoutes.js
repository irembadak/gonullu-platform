const express = require('express');
const router = express.Router(); 
const Organization = require('../models/Organization');
const User = require('../models/User');

// @desc    Yeni bir STK başvurusu oluştur
// @route   POST /api/organizations
// @access  Private (Sadece giriş yapmış kullanıcılar)
exports.createOrganization = async (req, res) => {
  try {
    // Önce bu kullanıcının zaten bir STK başvurusu var mı kontrol et
    const existingOrg = await Organization.findOne({ user: req.user.id });
    
    if (existingOrg) {
      return res.status(400).json({ success: false, message: "Zaten bir STK kaydınız veya başvurunuz bulunuyor." });
    }

    const orgData = {
      ...req.body,
      user: req.user.id, // Modelde 'user' olarak tanımladığımız için burayı user yaptık
      status: 'pending'
    };

    const organization = await Organization.create(orgData);

    // Başvuru yapan kullanıcının rolünü 'stk' olarak güncelle (Opsiyonel: Onaylanınca da yapılabilir)
    await User.findByIdAndUpdate(req.user.id, { role: 'stk' });

    res.status(201).json({
      success: true,
      data: organization,
      message: "STK başvurunuz başarıyla alındı, admin onayı bekleniyor."
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Tek bir STK detayını getir
// @route   GET /api/organizations/:id
// @access  Public
exports.getOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate('user', 'name email');
    
    if (!org) return res.status(404).json({ success: false, message: "STK bulunamadı." });
    
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Tüm onaylı STK'ları listele
// @route   GET /api/organizations
// @access  Public
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ status: 'approved' }).populate('user', 'name email');
    res.status(200).json({ 
        success: true, 
        count: organizations.length, 
        data: organizations 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Onay bekleyen STK başvurularını listele (Sadece Admin)
// @route   GET /api/organizations/admin/pending
// @access  Private/Admin
exports.getPendingOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ status: 'pending' }).populate('user', 'name email');
    res.status(200).json({ success: true, data: organizations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    STK başvurusunu onayla veya reddet (Sadece Admin)
// @route   PATCH /api/organizations/:id/verify
// @access  Private/Admin
exports.verifyOrganization = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' veya 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Geçersiz statü değeri." });
    }

    const org = await Organization.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!org) return res.status(404).json({ success: false, message: "STK bulunamadı." });

    res.status(200).json({ 
        success: true, 
        data: org, 
        message: `STK durumu '${status}' olarak güncellendi.` 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
module.exports = router;