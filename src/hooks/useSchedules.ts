import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleAPI } from '@/services/api'
import { CreateScheduleRequest, UpdateScheduleRequest, UpdateScheduleStatusRequest } from '@/types/schedule'

export const scheduleKeys = {
    all: ['schedules'] as const,
    lists: () => [...scheduleKeys.all, 'list'] as const,
    list: (filters: string) => [...scheduleKeys.lists(), { filters }] as const,
    details: () => [...scheduleKeys.all, 'detail'] as const,
    detail: (id: number) => [...scheduleKeys.details(), id] as const,
    my: () => [...scheduleKeys.all, 'my'] as const,
    upcoming: () => [...scheduleKeys.all, 'upcoming'] as const,
}

export function useSchedules() {
    return useQuery({
        queryKey: scheduleKeys.lists(),
        queryFn: scheduleAPI.getSchedules,
        staleTime: 2 * 60 * 1000,
    })
}

export function useMySchedules() {
    return useQuery({
        queryKey: scheduleKeys.my(),
        queryFn: scheduleAPI.getMySchedules,
        staleTime: 1 * 60 * 1000,
    })
}

export function useUpcomingSchedules() {
    return useQuery({
        queryKey: scheduleKeys.upcoming(),
        queryFn: scheduleAPI.getUpcomingSchedules,
        staleTime: 1 * 60 * 1000,
    })
}

export function useSchedule(id: number) {
    return useQuery({
        queryKey: scheduleKeys.detail(id),
        queryFn: () => scheduleAPI.getScheduleById(id),
        enabled: !!id,
    })
}

export function useCreateSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateScheduleRequest) => scheduleAPI.createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
        },
    })
}

export function useUpdateSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
            scheduleAPI.updateSchedule(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
        },
    })
}

export function useUpdateScheduleStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateScheduleStatusRequest }) =>
            scheduleAPI.updateScheduleStatus(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
        },
    })
}

export function useCancelSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => scheduleAPI.cancelSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
        },
    })
}

export function useDeleteSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => scheduleAPI.deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
        },
    })
}
