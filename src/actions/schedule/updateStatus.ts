import { api } from '@/services/api'
import { UpdateScheduleStatusRequest } from '@/types/schedule'

export async function updateScheduleStatus(id: number, data: UpdateScheduleStatusRequest) {
    const response = await api.patch(`/schedules/${id}/status`, data)
    return response.data
}
