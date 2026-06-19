import api from './api';
import { Notification } from '../types/notification';
import { PageResponse } from '../types/common';

const mapResponse = (n: any): Notification => ({
  ...n,
  title: n.type === 'EMAIL' ? 'Email Alert' : 'System Notification',
  type: n.type === 'EMAIL' ? 'REMINDER' as any : 'INFO' as any
});

const notificationService = {
  getAll: async (params?: { page?: number; size?: number }): Promise<PageResponse<Notification>> => {
    const response = await api.get<PageResponse<any>>('/notifications', { params });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },
  getUnread: async (): Promise<Notification[]> => {
    const response = await api.get<any[]>('/notifications/unread');
    return response.data.map(mapResponse);
  },
  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
export default notificationService;