import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { logsAPI } from '@/services/api'
import { CreateLogRequest } from '@/types/logs'
import { useAuth } from '@/contexts/AuthContext'

export const logsKeys = {
    all: ['logs'] as const,
    lists: () => [...logsKeys.all, 'list'] as const,
    list: (filters: string) => [...logsKeys.lists(), { filters }] as const,
    details: () => [...logsKeys.all, 'detail'] as const,
    detail: (id: number) => [...logsKeys.details(), id] as const,
    my: () => [...logsKeys.all, 'my'] as const,
    module: (module: string) => [...logsKeys.all, 'module', module] as const,
}

export function useLogs() {
    const { user } = useAuth()
    const isAdmin = user?.accountType === 'admin'

    return useQuery({
        queryKey: logsKeys.lists(),
        queryFn: logsAPI.getLogs,
        enabled: isAdmin,
        staleTime: 2 * 60 * 1000,
    })
}

export function useMyLogs() {
    return useQuery({
        queryKey: logsKeys.my(),
        queryFn: logsAPI.getMyLogs,
        staleTime: 1 * 60 * 1000,
    })
}

export function useLogsByModule(module: string) {
    return useQuery({
        queryKey: logsKeys.module(module),
        queryFn: () => logsAPI.getLogsByModule(module),
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
