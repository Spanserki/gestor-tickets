import { api } from "@/lib/api";
import queryClient from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export function GetEmployees(page: number, perPage: number, searchName: string) {
    return useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await api.get(`/employee`, {
                params: {
                    page,
                    perPage,
                    searchName
                }
            });
            const results = response.data;
            const total = Number(response.headers['x-total-count']);
            return {
                results,
                total
            };
        },
        staleTime: 1000 * 60 //60 seconds
    });
}

export function GetEmployee(id: string) {
    return useQuery({
        queryKey: ['employee', id],
        queryFn: async () => {
            const response = await api.get(`/employee/${id}`);
            return response.data
        },
        staleTime: 1000 * 60, //60 seconds
    })
}

export const PrefetchEmployee = async (id: string) => {
    await queryClient.prefetchQuery({
        queryKey: ['employee', id],
        queryFn: async () => {
            const response = await api.get(`/employee/${id}`);
        },
        staleTime: 1000 * 60 //60 seconds
    })
}

export function GetTickets() {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const response = await api.get(`/ticket`);
            return response.data
        },
        staleTime: 1000 * 60, //60 seconds
    })
}