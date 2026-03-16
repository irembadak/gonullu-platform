const admin = require("firebase-admin");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Yetkisiz erişim: Token bulunamadı' });
    }

    const token = authHeader.split(' ')[1];
    
    // 1. Firebase üzerinden kimlik doğrula (Kullanıcı gerçekten o kişi mi?)
    const decoded = await admin.auth().verifyIdToken(token);
    
    // 2. MongoDB'den kullanıcının güncel yetkilerini çek
    // Sadece Firebase UID'sine bakıyoruz, email veya isim kontrolü yok.
    let dbUser = await User.findOne({ firebaseUid: decoded.uid });

    if (!dbUser) {
      // Eğer kullanıcı DB'de yoksa ama Firebase'de varsa, email ile tekrar dene (Yedek kontrol)
      dbUser = await User.findOne({ email: decoded.email });
    }

    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'Kullanıcı veritabanında bulunamadı.' });
    }

    // 3. req.user objesini doğrudan MongoDB nesnesiyle doldur
    // Yetki kontrolü (roleAuth) artık sadece bu nesnedeki 'role' alanına bakacak.
    req.user = dbUser; 
    req.firebaseUid = decoded.uid;

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token' });
  }
};

const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    // allowedRoles bir dizi (Array) değilse diziye çevir
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Kullanıcının rolü, izin verilen roller listesinde var mı?
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`[YETKİ REDDİ] Kullanıcı: ${req.user?.email}, Mevcut Rol: ${req.user?.role}, Gereken: ${roles}`);
      return res.status(403).json({ 
        success: false, 
        message: `Bu işlem için yetkiniz (${req.user?.role || 'Bilinmeyen'}) yeterli değil.` 
      });
    }
    next();
  };
};

module.exports = { protect, roleAuth };