import API from '../services/api';
import { useToast } from '../hooks/useToast';

export const useNotification = () => {
  const toast = useToast();

  // Merkezi bildirim tetikleyici (MUI ve projenin geri kalanıyla uyumlu)
  const showToast = (title, message, status) => {
    // useToast hook'umuz artık daha esnek bir yapıya sahip
    toast({
      title: title,
      description: message,
      status: status, // 'success', 'error', 'info', 'warning'
      duration: 4000,
    });
  };

  // Firebase Push Notification token'ını veritabanına mühürler
  const registerToken = async (fcmToken) => {
    if (!fcmToken) return;

    try {
      // Backend tarafında bu endpoint'in olduğundan emin olmalıyız
      await API.post('/users/register-fcm-token', {
        token: fcmToken,
      });
      console.log('🔔 FCM Token sisteme mühürlendi.');
    } catch (error) {
      // Sessiz hata yönetimi: Kullanıcıyı rahatsız etmeden logla
      console.error('FCM token kaydı başarısız (Backend hatası):', error);
    }
  };

  return {
    showSuccess: (message) => showToast('İşlem Başarılı', message, 'success'),
    showError: (message) => showToast('Hata Oluştu', message, 'error'),
    showInfo: (message) => showToast('Bilgilendirme', message, 'info'),
    showWarning: (message) => showToast('Dikkat', message, 'warning'),
    registerToken: registerToken,
  };
};