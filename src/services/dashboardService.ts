import api from './api';

export interface DashboardStats {
  totalStudyHoursWeek: number;
  activePlansCount: number;
  certificationsCount: number;
  goalsCount: number;
  upcomingCertifications: Array<{
    id: number;
    name: string;
    provider?: string;
    examDate?: string;
    targetDate?: string;
    status: string;
    progress: number;
  }>;
  recentStudySessions: Array<{
    id: number;
    sessionDate: string;
    durationMinutes: number;
    notes?: string;
    topicCovered: string;
  }>;
  unreadNotificationsCount: number;
  learningStreak: number;
}

const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard');
    return response.data;
  },
};
export default dashboardService;