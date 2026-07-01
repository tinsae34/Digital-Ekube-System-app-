import { api } from './api';

export interface Payment {
    id: string;
    group_id: string;
    user_id: string;
    amount: string;
    payment_date: string;
    status: string;
    reference?: string;
    notes?: string;
    created_at: string;
}

export const paymentService = {
    getAll: async (): Promise<{ payments: Payment[] }> => {
        return api.get('/api/payments');
    },

    create: async (data: {
        group_id: string;
        user_id: string;
        amount: number;
        reference?: string;
        notes?: string;
    }): Promise<{ message: string; payment: Payment }> => {
        return api.post('/api/payments', data);
    },

    getByGroup: async (groupId: string): Promise<{ payments: Payment[] }> => {
        return api.get(`/api/payments/group/${groupId}`);
    },

    getUserPayments: async (): Promise<{ payments: Payment[] }> => {
        return api.get('/api/payments/my-payments');
    },
};
