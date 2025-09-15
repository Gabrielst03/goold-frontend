import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSchedules } from '@/actions/schedule/get'
import { getMySchedules } from '@/actions/schedule/getMy'
import { getUpcomingSchedules } from '@/actions/schedule/getUpcoming'
import { getScheduleById } from '@/actions/schedule/getById'
import { createSchedule } from '@/actions/schedule/create'
import { updateSchedule } from '@/actions/schedule/update'
import { updateScheduleStatus } from '@/actions/schedule/updateStatus'
import { cancelSchedule } from '@/actions/schedule/cancel'
import { deleteSchedule } from '@/actions/schedule/delete'
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
        queryFn: () => getSchedules(1, 100),
        staleTime: 2 * 60 * 1000,
    })
}

export function useMySchedules() {
    return useQuery({
        queryKey: scheduleKeys.my(),
        queryFn: () => getMySchedules(1, 100),
        staleTime: 1 * 60 * 1000,
    })
}

export function useUpcomingSchedules() {
    return useQuery({
        queryKey: scheduleKeys.upcoming(),
        queryFn: getUpcomingSchedules,
        staleTime: 1 * 60 * 1000,
    })
}

export function useSchedule(id: number) {
    return useQuery({
        queryKey: scheduleKeys.detail(id),
        queryFn: () => getScheduleById(id),
        enabled: !!id,
    })
}

export function useCreateSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateScheduleRequest) => createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'paginated'
            })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'my' &&
                    query.queryKey[2] === 'paginated'
            })
        },
    })
}

export function useUpdateSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
            updateSchedule(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'paginated'
            })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'my' &&
                    query.queryKey[2] === 'paginated'
            })
        },
    })
}

export function useUpdateScheduleStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateScheduleStatusRequest }) =>
            updateScheduleStatus(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'paginated'
            })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'my' &&
                    query.queryKey[2] === 'paginated'
            })
        },
    })
}

export function useCancelSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => cancelSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'paginated'
            })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'my' &&
                    query.queryKey[2] === 'paginated'
            })
        },
    })
}

export function useDeleteSchedule() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.all })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'paginated'
            })
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === 'schedules' &&
                    query.queryKey[1] === 'my' &&
                    query.queryKey[2] === 'paginated'
            })
        },
    })
}
