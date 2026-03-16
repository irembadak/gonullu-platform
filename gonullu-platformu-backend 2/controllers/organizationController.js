const Organization = require('../models/Organization');
const User = require('../models/User');

// @desc    Yeni bir STK başvurusu oluştur
// @route   POST /api/organizations
// @access  Private (Sadece giriş yapmış kullanıcılar)
exports.createOrganization = async (req, res) => {
  try {
    const existingOrg = await Organization.findOne({ owner: req.user.id });
    
    if (existingOrg) {
      return res.status(400).json({ success: false, message: "Zaten bir STK kaydınız bulunuyor" });
    }

    const orgData = {
      ...req.body,
      owner: req.user.id,
      status: 'pending'
    };

    const organization = await Organization.create(orgData);

    await User.findByIdAndUpdate(req.user.id, { role: 'stk' });

    res.status(201).json({
      success: true,
      data: organization,
      message: "STK başvurunuz alındı, admin onayı bekleniyor."
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    
exports.getOrganization = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate('owner', 'name email');
    
    if (!org) return res.status(404).json({ success: false, message: "STK bulunamadı" });
    
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};