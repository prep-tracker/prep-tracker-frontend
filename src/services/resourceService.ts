import api from './api';
import { Resource, ResourceCreateRequest, ResourceUpdateRequest } from '../types/resource';
import { PageResponse, SearchParams } from '../types/common';

// Helper to map backend resource response to frontend Resource model
const mapResponse = (r: any): Resource => ({
  ...r,
  title: r.name,
  category: r.category && typeof r.category === 'object' ? r.category.name : r.category
});

export const resourceService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<Resource>> => {
    const response = await api.get<PageResponse<any>>('/resources', { params });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },

  getById: async (id: number): Promise<Resource> => {
    const response = await api.get<any>(`/resources/${id}`);
    return mapResponse(response.data);
  },

  create: async (data: ResourceCreateRequest): Promise<Resource> => {
    const backendData = {
      name: data.title,
      type: data.type,
      url: data.url,
      difficulty: data.difficulty,
      tags: data.tags,
      categoryName: data.category
    };
    const response = await api.post<any>('/resources', backendData);
    return mapResponse(response.data);
  },

  update: async (id: number, data: ResourceUpdateRequest): Promise<Resource> => {
    const backendData = {
      name: data.title,
      type: data.type,
      url: data.url,
      difficulty: data.difficulty,
      tags: data.tags,
      categoryName: data.category,
      completed: data.completed
    };
    const response = await api.put<any>(`/resources/${id}`, backendData);
    return mapResponse(response.data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/resources/${id}`);
  },

  search: async (query: string, params?: SearchParams): Promise<PageResponse<Resource>> => {
    const response = await api.get<PageResponse<any>>('/resources/search', {
      params: { ...params, search: query },
    });
    return {
      ...response.data,
      content: response.data.content.map(mapResponse)
    };
  },
};

export default resourceService;