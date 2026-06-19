export enum CertificationStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export interface Certification {
  id: number;
  name: string;
  provider?: string;
  description?: string;
  status: CertificationStatus;
  targetDate?: string;
  completedDate?: string;
  expiryDate?: string;
  progress: number;
  credentialId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationCreateRequest {
  name: string;
  provider?: string;
  description?: string;
  status?: CertificationStatus;
  targetDate?: string;
  expiryDate?: string;
  credentialId?: string;
  notes?: string;
}

export interface CertificationUpdateRequest extends Partial<CertificationCreateRequest> {
  progress?: number;
  completedDate?: string;
  status?: CertificationStatus;
}