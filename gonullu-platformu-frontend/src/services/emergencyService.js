import { firestore } from '../firebase';
import api from './api';

export const submitEmergencyRequest = async (data) => {
  try {
    const response = await api.post('/emergencies', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEmergencies = async () => {
  const response = await api.get('/emergencies');
  return response.data;
};