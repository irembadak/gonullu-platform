const admin = require('firebase-admin');
const User = require('../models/User');
const Event = require('../models/Event');

const syncFirebaseToMongo = async () => {
  try {
    const listUsersResult = await admin.auth().listUsers(1000); 
    
    const userOps = listUsersResult.users.map(fbUser => ({
      updateOne: {
        filter: { firebaseUid: fbUser.uid },
        update: {
          // $setOnInsert: Sadece kullanıcı ilk kez oluşturulurken bu verileri yazar.
          // Mevcut kullanıcıda bu alanlar ASLA değişmez.
          $setOnInsert: { 
            email: fbUser.email,
            name: fbUser.displayName || 'Yeni Gönüllü',
            role: 'volunteer', // Varsayılan rütbe sadece ilk kayıtta
            isVerified: false,
            password: 'tempPassword123'
          },
          // $set: Sadece teknik/güncel kalması gereken verileri günceller.
          // Rütbe (role) ve İsim (name) alanlarını buraya EKLEMEDİK ki MongoDB'deki verin korunsun.
          $set: {
            firebaseUid: fbUser.uid
          }
        },
        upsert: true
      }
    }));

    if (userOps.length > 0) await User.bulkWrite(userOps);

    // Etkinlik Senkronizasyonu
    const eventsSnapshot = await admin.database().ref('events').once('value');
    const eventsData = eventsSnapshot.val();

    if (eventsData) {
      const eventOps = Object.keys(eventsData).map(firebaseId => {
        const data = eventsData[firebaseId];
        return {
          updateOne: {
            filter: { firebaseId: firebaseId }, 
            update: {
              $set: {
                title: data.title,
                description: data.description,
                status: data.status || 'pending' // Default olarak beklemede
              }
            },
            upsert: true
          }
        };
      });
      if (eventOps.length > 0) await Event.bulkWrite(eventOps);
    }

    console.log(` Senkronizasyon tamamlandı: Mevcut kullanıcıların rütbeleri korundu.`);
    return { success: true };

  } catch (err) {
    console.error('Senkronizasyon hatası:', err.message);
    throw err;
  }
};

module.exports = { syncFirebaseToMongo };