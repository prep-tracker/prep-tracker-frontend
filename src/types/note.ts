export interface Note {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCreateRequest {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
}

export interface NoteUpdateRequest extends Partial<NoteCreateRequest> {}