import api from './api';
import { Certification, CertificationCreateRequest, CertificationUpdateRequest } from '../types/certification';
import { PageResponse, SearchParams } from '../types/common';

export const certificationService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<Certification>> => {
    const response = await api.get<PageResponse<Certification>>('/certifications', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Certification> => {
    const response = await api.get<Certification>(`/certifications/${id}`);
    return response.data;
  },
  create: async (data: CertificationCreateRequest): Promise<Certification> => {
    const response = await api.post<Certification>('/certifications', data);
    return response.data;
  },
  update: async (id: number, data: CertificationUpdateRequest): Promise<Certification> => {
    const response = await api.put<Certification>(`/certifications/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/certifications/${id}`);
  },
};
export default certificationService;