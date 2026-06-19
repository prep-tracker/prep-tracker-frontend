import api from './api';
import { Note, NoteCreateRequest, NoteUpdateRequest } from '../types/note';
import { PageResponse, SearchParams } from '../types/common';

const noteService = {
  getAll: async (params?: SearchParams): Promise<PageResponse<Note>> => {
    const response = await api.get<PageResponse<Note>>('/notes', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Note> => {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },
  create: async (data: NoteCreateRequest): Promise<Note> => {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },
  update: async (id: number, data: NoteUpdateRequest): Promise<Note> => {
    const response = await api.put<Note>(`/notes/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
  searchByTags: async (tags: string[], params?: SearchParams): Promise<PageResponse<Note>> => {
    const response = await api.get<PageResponse<Note>>('/notes/search', {
      params: { ...params, tags: tags.join(',') },
    });
    return response.data;
  },
};
export default noteService;