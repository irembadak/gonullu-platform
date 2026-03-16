const User = require("../models/User");
const admin = require('../config/firebase');

// @desc    Mevcut kullanıcı bilgilerini getir
exports.getMe = async (req, res) => {
    try {
        // req.user.id üzerinden kullanıcıyı bul (protect middleware'inden gelir)
        const user = await User.findOne({ firebaseUid: req.user.firebaseUid || req.user.id }).select('-password -__v');
        if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
};

// @desc    Yeni kullanıcı kaydı (Rütbe Korumalı)
exports.registerUser = async (req, res) => {
    try {
        const { firebaseUid, name, email, role } = req.body;
        
        let user = await User.findOne({ firebaseUid });
        if (user) return res.status(400).json({ success: false, message: "Kullanıcı zaten kayıtlı" });

        // Kayıt sırasında rolü 'stk' ise bekleyen rütbe olarak ata, 'volunteer' olarak başlat
        user = await User.create({ 
            firebaseUid, 
            name, 
            email, 
            role: role === 'stk' ? 'volunteer' : role || 'volunteer', 
            pendingRole: role === 'stk' ? 'stk' : null,
            isVerified: false,
            location: { 
                type: 'Point',
                coordinates: [27.1428, 38.4237],
                city: 'İzmir', 
                district: 'Konak' 
            } 
        });

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Gönüllüden STK'ya geçiş isteği gönder
exports.requestStkStatus = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.firebaseUid || req.user.id });
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        if (user.role === 'stk') return res.status(400).json({ message: "Zaten STK rütbesindesiniz." });

        user.pendingRole = 'stk';
        await user.save();
        res.status(200).json({ success: true, message: "STK olma isteğiniz admin onayına gönderildi." });
    } catch (err) {
        res.status(500).json({ success: false, message: "İstek gönderilirken hata oluştu." });
    }
};

// @desc    Admin: STK isteğini onayla
exports.approveStkRequest = async (req, res) => {
    try {
        const { userId } = req.body; 
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

        user.role = 'stk';
        user.isVerified = true;
        user.pendingRole = null;
        await user.save();

        res.status(200).json({ success: true, message: `${user.name} artık resmi bir STK hesabıdır.` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Onay işlemi başarısız." });
    }
};

// @desc    Profil güncelleme (İsim ve Bilgi Değişikliği)
exports.updateMyProfile = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.firebaseUid || req.user.id });
        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        
        const allowedUpdates = ['name', 'skills', 'interests', 'profilePhoto', 'location', 'organizationName'];
        
        allowedUpdates.forEach(update => {
            if (req.body[update] !== undefined) {
                if (update === 'location' && typeof req.body.location === 'object') {
                    user.location = {
                        ...user.location,
                        city: req.body.location.city || user.location.city,
                        district: req.body.location.district || user.location.district
                    };
                } else {
                    user[update] = req.body[update];
                }
            }
        });

        // Veri tutarlılığı koruma
        if (user.role === 'stk') {
            user.isVerified = true;
        }

        const updatedUser = await user.save();
        res.status(200).json({ success: true, data: updatedUser });

    } catch (error) {
        console.error("GÜNCELLEME HATASI:", error);
        res.status(500).json({ success: false, message: "Güncelleme başarısız: " + error.message });
    }
};

// @desc    Firebase ve MongoDB Senkronizasyonu (Rütbe Bozmayan Versiyon)
exports.syncUsers = async (req, res) => {
    try {
        const firebaseUsers = await admin.auth().listUsers();
        const mongoUsers = await User.find({}, 'firebaseUid email role');
        const mongoUids = mongoUsers.map(u => u.firebaseUid);
        
        const missingUsers = firebaseUsers.users.filter(u => !mongoUids.includes(u.uid));

        if (missingUsers.length === 0) return res.json({ success: true, message: "Veritabanı zaten senkronize." });

        const createPromises = missingUsers.map(fbUser => User.create({
            firebaseUid: fbUser.uid,
            name: fbUser.displayName || 'Yeni Gönüllü',
            email: fbUser.email,
            role: 'volunteer',
            location: { type: 'Point', coordinates: [27.1428, 38.4237], city: 'İzmir', district: 'Konak' }
        }));

        await Promise.all(createPromises);
        res.json({ success: true, message: `${missingUsers.length} yeni kullanıcı başarıyla MongoDB'ye eklendi.` });
    } catch (err) {
        console.error("Senkronizasyon Hatası:", err);
        res.status(500).json({ success: false, message: "Kullanıcılar senkronize edilemedi." });
    }
};

// @desc    UID ile kullanıcı getir
exports.getUserByUid = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
};

exports.registerFCMToken = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ firebaseUid: req.user.firebaseUid || req.user.id });
        if (user && !user.fcmTokens.includes(token)) {
            user.fcmTokens.push(token);
            await user.save();
        }
        res.status(200).json({ success: true, message: "Token kaydedildi" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Token kaydedilemedi" });
    }
};