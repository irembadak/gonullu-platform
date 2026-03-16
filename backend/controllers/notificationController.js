const { messaging } = require('../config/firebase');
const User = require('../models/User');

exports.sendNotification = async (req, res) => {
  const { userId, title, body, data = {}, isBroadcast = false } = req.body;
  
  try {
    let tokens = [];
    let userRecord = null;
    
    if (isBroadcast) {
      const allUsers = await User.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } }).select('fcmTokens');
      tokens = allUsers.flatMap(u => u.fcmTokens);
    } else {
      userRecord = await User.findById(userId).select('fcmTokens');
      if (!userRecord || !userRecord.fcmTokens.length) {
        return res.status(404).json({ error: 'Hedef kullanıcı veya aktif token bulunamadı' });
      }
      tokens = userRecord.fcmTokens;
    }

    const messages = tokens.map(token => ({
      token, 
      notification: { title, body },
      data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
      android: { priority: 'high', notification: { sound: 'default' } },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } }
    }));

    if (messages.length === 0) return res.status(400).json({ message: "Gönderilecek cihaz bulunamadı" });

    const batchResponse = await messaging.sendEach(messages);
    const failedTokens = [];

    batchResponse.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(tokens[idx]);
      }
    });

    if (failedTokens.length > 0 && !isBroadcast) {
      await User.updateOne(
        { _id: userId },
        { $pull: { fcmTokens: { $in: failedTokens } } }
      );
    }

    res.json({
      success: true,
      sentCount: batchResponse.successCount,
      failedCount: batchResponse.failureCount
    });
    
  } catch (error) {
    console.error('FCM Hatası:', error);
    res.status(500).json({ error: "Bildirim servisi hatası" });
  }
}; 