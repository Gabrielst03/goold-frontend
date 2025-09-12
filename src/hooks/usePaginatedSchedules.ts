import { useQuery } from '@tanstack/react-query'
import { getSchedules } from '@/actions/schedule/get'
import { getMySchedules } from '@/actions/schedule/getMy'
import { ScheduleResponse } from '@/types/schedule'

export function usePaginatedSchedules(page: number = 1, limit: number = 10) {
    return useQuery<ScheduleResponse>({
        queryKey: ['schedules', 'paginated', { page, limit }],
        queryFn: () => getSchedules(page, limit),
        staleTime: 2 * 60 * 1000,
    })
}

export function usePaginatedMySchedules(page: number = 1, limit: number = 10) {
    return useQuery<ScheduleResponse>({
        queryKey: ['schedules', 'my', 'paginated', { page, limit }],
        queryFn: () => getMySchedules(page, limit),
        staleTime: 1 * 60 * 1000,
    })
}
