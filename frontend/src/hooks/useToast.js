import { useNotification } from '../context/NotificationContext';
export const useToast = () => {
  const toast = ({ title, status, duration = 3000 }) => {
    console.log(`[${status.toUpperCase()}]: ${title}`);
  };

  return toast;
};