import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { logsAPI } from '@/services/api'
import { CreateLogRequest } from '@/types/logs'

export const logsKeys = {
    all: ['logs'] as const,
    lists: () => [...logsKeys.all, 'list'] as const,
    list: (page: number, limit: number) => [...logsKeys.lists(), { page, limit }] as const,
    details: () => [...logsKeys.all, 'detail'] as const,
    detail: (id: number) => [...logsKeys.details(), id] as const,
    my: (page: number, limit: number) => [...logsKeys.all, 'my', { page, limit }] as const,
    module: (module: string, page: number, limit: number) => [...logsKeys.all, 'module', module, { page, limit }] as const,
}

export function useLogs(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: logsKeys.list(page, limit),
        queryFn: () => logsAPI.getLogs(page, limit),
        staleTime: 2 * 60 * 1000,
    })
}

export function useMyLogs(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: logsKeys.my(page, limit),
        queryFn: () => logsAPI.getMyLogs(page, limit),
        staleTime: 1 * 60 * 1000,
    })
}

export function useLogsByModule(module: string, page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: logsKeys.module(module, page, limit),
        queryFn: () => logsAPI.getLogsByModule(module, page, limit),
        enabled: !!module,
        staleTime: 2 * 60 * 1000,
    })
}

export function useCreateLog() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateLogRequest) => logsAPI.createLog(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: logsKeys.all })
        },
    })
}
