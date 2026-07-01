import { api } from './api';

export interface DashboardStats {
    totalPool: number;
    activeGroups: number;
    nextDrawDate: string | null;
    totalPaid: number;
    totalReceived: number;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        return api.get('/api/dashboard/stats');
    },
};
