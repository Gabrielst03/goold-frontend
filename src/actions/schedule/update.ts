import { api } from '@/services/api'
import { UpdateScheduleRequest } from '@/types/schedule'

export async function updateSchedule(id: number, data: UpdateScheduleRequest) {
    const response = await api.put(`/schedules/${id}`, data)
    return response.data
}
