const Event = require('../models/Event');
const User = require('../models/User');
const admin = require('firebase-admin');

exports.createEvent = async (req, res) => {
    try {
        const organizationId = req.user?._id || req.user?.id;
        
        if (!organizationId) {
            return res.status(401).json({ success: false, message: "Kullanıcı yetkisi doğrulanamadı." });
        }

        const eventData = {
            ...req.body,
            organization: organizationId,
            status: 'approved' 
        };

        // 1. MongoDB Kaydı
        const event = await Event.create(eventData);

        // 2. Yanıtı Hemen Dön
        res.status(201).json({ success: true, data: event });

        // 3. Arka Plan İşlemleri
        setImmediate(async () => {
            try {
                const db = admin.database();
                await db.ref(`events/${event._id}`).set({
                    title: event.title,
                    organization: organizationId.toString(),
                    status: 'approved'
                });
                console.log("✔ Firebase arka planda güncellendi.");
            } catch (fbErr) {
                console.warn("⚠ Firebase senkronizasyonu arka planda başarısız:", fbErr.message);
            }
        });

    } catch (err) {
        console.error("Kritik Kayıt Hatası:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Sistem hatası: " + err.message });
        }
    }
};

// @desc    Tüm etkinlikleri HİÇBİR FİLTRE OLMADAN (Debug Modu) getir
exports.getEvents = async (req, res) => {
    try {
        console.log("--- DEBUG: Tüm etkinlikler çekiliyor ---");
        
        // KRİTİK DEĞİŞİKLİK: Süslü parantezlerin içini boşalttık {}. 
        // Veritabanında status ne olursa olsun her şeyi getirir.
        const events = await Event.find({}).populate('organization', 'name profilePhoto'); 
        
        console.log(`Veritabanında toplam ${events.length} adet doküman bulundu.`);
        
        // Veriyi direkt dizi olarak dönüyoruz
        res.status(200).json(events);
    } catch (err) { 
        console.error("Etkinlik getirme hatası:", err);
        res.status(500).json({ message: err.message }); 
    }
};

exports.joinEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });
        const userId = req.user._id || req.user.id;
        if (event.participants.includes(userId)) return res.status(400).json({ success: false, message: 'Zaten kayıtlısınız' });
        event.participants.push(userId);
        await event.save();
        await User.findByIdAndUpdate(userId, { $addToSet: { joinedEvents: event._id } });
        res.json({ success: true, message: 'Etkinliğe başarıyla katıldınız' });
    } catch (err) { next(err); }
};

exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' }).populate('organization', 'name email'); 
        res.status(200).json({ success: true, data: events });
    } catch (err) { res.status(500).json({ success: false, message: "Bekleyenler getirilemedi" }); }
};

exports.approveEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        res.status(200).json({ success: true, data: event });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.rejectEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.status(200).json({ success: true, data: event });
    } catch (err) { res.status(500).json({ success: false }); }
};
// KRİTİK EKLENTİ: Tek bir etkinliğin tüm detaylarını ID'sine göre getiren fonksiyon
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organization', 'name email profilePhoto')
            .populate('participants', 'name email'); // İsteğe bağlı, katılımcıların adını görmek için
            
        if (!event) {
            return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });
        }
        
        // Frontend'in beklediği gibi direkt veriyi dönüyoruz
        res.status(200).json(event);
    } catch (err) {
        console.error("Etkinlik detay hatası:", err);
        res.status(500).json({ success: false, message: "Etkinlik detayları getirilirken sunucu hatası oluştu." });
    }
};