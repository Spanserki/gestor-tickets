import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "react-query";

export function GetEmployees(page: number, perPage: number, searchName: string) {
    return (
        useQuery(
            ['employees', page],
            async () => {
                const response = await api.get(`/employee`, {
                    params: {
                        page,
                        perPage,
                        searchName
                    }
                });
                const results = response.data;
                const total = Number(response.headers['x-total-count'])
                return {
                    results,
                    total
                }
            },
            {
                staleTime: 1000 * 60,
            }
        )
    )
}

export function GetEmployee(id: string) {
    return (
        useQuery(
            ['employee', id],
            async () => {
                const response = await api.get(`/employee/${id}`);
                return response.data;
            },
            {
                staleTime: 1000 * 60,
            }
        )
    )
}

export async function PrefetchEmployee(id: string) {
    await queryClient.prefetchQuery(
        ['employee', id],
        async () => {
            const response = await api.get(`/employee/${id}`);
            return response.data;
        },
        {
            staleTime: 1000 * 60,
        }
    )
}