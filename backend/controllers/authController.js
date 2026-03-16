const admin = require('firebase-admin');
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, firebaseUid: user.firebaseUid, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// @desc    Firebase Auth üzerinden yeni kullanıcı kaydı (Manuel Kayıt)
// @route   POST /api/auth/register
exports.registerWithFirebase = async (req, res) => {
    let firebaseUser;
    try {
        const { email, password, name, role, location } = req.body;
        firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: name
        });
        const user = new User({
            firebaseUid: firebaseUser.uid,
            name,
            email,
            role: role || "volunteer",
            location: location || {
                city: "İzmir",
                district: "Bornova",
                coordinates: [27.14, 38.42]
            },
            isVerified: true
        });

        await user.save();
        
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            user: {
                uid: user.firebaseUid,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        if (firebaseUser) {
            await admin.auth().deleteUser(firebaseUser.uid);
        }

        console.error("Kayıt hatası:", err);
        const statusCode = err.code?.startsWith('auth/') ? 400 : 500;
        res.status(statusCode).json({ success: false, message: err.message });
    }
};

// @desc    Geleneksel Giriş (Email/Password)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "E-posta ve şifre gereklidir" });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: "Geçersiz kimlik bilgileri" });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
};

// @desc    Firebase UID ile Giriş (Google/Apple vb. girişler için otomatik kayıt)
// @route   POST /api/auth/firebase-login
exports.firebaseLogin = async (req, res) => {
    try {
        const { uid, email, name, profilePhoto } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ success: false, message: "UID ve e-posta gereklidir." });
        }

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                name: name || 'Yeni Gönüllü',
                email: email,
                profilePhoto: profilePhoto || '',
                role: 'volunteer',
                isVerified: true,
                location: { city: 'Belirtilmemiş', district: 'Belirtilmemiş', coordinates: [0, 0] }
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePhoto: user.profilePhoto
            }
        });
    } catch (error) {
        console.error('Firebase Login Error:', error.message);
        res.status(500).json({ success: false, message: "Giriş işlemi sırasında sunucu hatası." });
    }
};

// @desc    Tüm kullanıcıları listele (Sadece Admin)
exports.getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Kullanıcılar getirilemedi." });
    }
};

// @desc    Manuel Firebase-Mongo Senkronizasyonu (Sadece Admin)
exports.syncManual = async (req, res) => {
    try {
        const { syncFirebaseToMongo } = require('../services/syncService');
        const result = await syncFirebaseToMongo();
        res.status(200).json({ success: true, message: 'Senkronizasyon başarılı', data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};