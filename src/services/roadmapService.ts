import api from './api';
import { Roadmap, RoadmapItem, RoadmapCreateRequest, RoadmapUpdateRequest, RoadmapItemCreateRequest, RoadmapItemUpdateRequest } from '../types/roadmap';
import { PageResponse } from '../types/common';

export const roadmapService = {
  getAll: async (params?: { page?: number; size?: number }): Promise<PageResponse<Roadmap>> => {
    const response = await api.get<PageResponse<Roadmap>>('/roadmaps', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Roadmap> => {
    const response = await api.get<Roadmap>(`/roadmaps/${id}`);
    return response.data;
  },
  create: async (data: RoadmapCreateRequest): Promise<Roadmap> => {
    const response = await api.post<Roadmap>('/roadmaps', data);
    return response.data;
  },
  update: async (id: number, data: RoadmapUpdateRequest): Promise<Roadmap> => {
    const response = await api.put<Roadmap>(`/roadmaps/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/roadmaps/${id}`);
  },
  getItems: async (roadmapId: number): Promise<RoadmapItem[]> => {
    const response = await api.get<RoadmapItem[]>(`/roadmaps/${roadmapId}/items`);
    return response.data;
  },
  addItem: async (roadmapId: number, data: RoadmapItemCreateRequest): Promise<RoadmapItem> => {
    const response = await api.post<RoadmapItem>(`/roadmaps/${roadmapId}/items`, data);
    return response.data;
  },
  updateItem: async (roadmapId: number, itemId: number, data: RoadmapItemUpdateRequest): Promise<RoadmapItem> => {
    const response = await api.put<RoadmapItem>(`/roadmaps/${roadmapId}/items/${itemId}`, data);
    return response.data;
  },
  deleteItem: async (roadmapId: number, itemId: number): Promise<void> => {
    await api.delete(`/roadmaps/${roadmapId}/items/${itemId}`);
  },
};
export default roadmapService;