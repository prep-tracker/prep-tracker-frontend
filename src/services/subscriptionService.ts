import api from './api';
import { Subscription, Payment, UpgradeRequest } from '../types/subscription';

export const subscriptionService = {
  getSubscription: async (): Promise<Subscription> => {
    const response = await api.get<Subscription>('/subscriptions/me');
    return response.data;
  },

  upgradeSubscription: async (data: UpgradeRequest): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions/upgrade', data);
    return response.data;
  },

  cancelSubscription: async (): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions/cancel');
    return response.data;
  },

  getPaymentHistory: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/subscriptions/payments');
    return response.data;
  },
};

export default subscriptionService;
