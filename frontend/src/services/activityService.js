import { firestore } from '../firebase';

import api from './api';

export const getUpcomingActivities = async () => {
  try {
    const response = await api.get('/events/upcoming');
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const joinActivity = async (activityId) => {
  await api.post(`/events/${activityId}/join`);
};