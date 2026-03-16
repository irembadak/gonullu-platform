import { useNotification } from '../context/NotificationContext';

// Not: Eğer bir context yapın varsa onu kullanmak en iyisidir. 
// Eğer yoksa, Chakra'dan kurtulmak için en hızlı ve şık yol 'react-hot-toast' kullanmaktır.
// Şimdilik projedeki tutarlılık için basit bir yönlendirici yapalım:

export const useToast = () => {
  // Bu hook, çağırdığın yerde MUI Alert veya Snackbar tetikleyecek şekilde ayarlanmalı.
  // Chakra'yı projeden kaldırmak için terminale: npm uninstall @chakra-ui/toast yazabilirsin.
  
  const toast = ({ title, status, duration = 3000 }) => {
    // Burada basit bir konsol log yerine browser notification veya MUI Snackbar tetiklenmeli
    console.log(`[${status.toUpperCase()}]: ${title}`);
    // Not: NotificationContext.js'indeki showNotification fonksiyonunu buraya bağlamak en doğrusu!
  };

  return toast;
};