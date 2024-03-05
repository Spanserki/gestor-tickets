import { api } from "@/lib/api";
import { useQuery } from "react-query";

export function GetEmployees(page: number, perPage: number, searchName: string) {
    return (
        useQuery(
            ['getEmployees', page],
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
        )
    )
}

export function GetQuizis(selectedInitialDate: any, selectedFinalDate: any) {
    return (
        useQuery(
            ['getQuizis'],
            async () => {
                const response = await api.get(`/quiz`, {
                    params: {
                        selectedInitialDate,
                        selectedFinalDate
                    }
                });
                return response.data;
            },
        )
    )
}

export function GetQuiz(id: string) {
    return (
        useQuery(
            ['quiz', id],
            async () => {
                const response = await api.get(`/quiz/${id}`);
                return response.data;
            },
            {
                staleTime: 1000 * 60 * 1, //1 minuto
            }
        )
    )
}