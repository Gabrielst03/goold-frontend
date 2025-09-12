import { api } from '@/services/api'

export async function getMySchedules(page: number = 1, limit: number = 10) {
    const response = await api.get('/schedules/my-schedules', { params: { page, limit } })
    return response.data
}
