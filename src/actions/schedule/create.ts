import { api } from '@/services/api'
import { CreateScheduleRequest } from '@/types/schedule'

export async function createSchedule(data: CreateScheduleRequest) {
    const response = await api.post('/schedules', data)
    return response.data
}
