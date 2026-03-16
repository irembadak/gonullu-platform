import API from '../services/api';
import { useToast } from '../hooks/useToast';

export const useNotification = () => {
  const toast = useToast();
  const showToast = (title, message, status) => {
    toast({
      title: title,
      description: message,
      status: status, // 'success', 'error', 'info', 'warning'
      duration: 4000,
    });
  };
  const registerToken = async (fcmToken) => {
    if (!fcmToken) return;

    try {
      await API.post('/users/register-fcm-token', {
        token: fcmToken,
      });
      console.log('🔔 FCM Token sisteme mühürlendi.');
    } catch (error) {
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