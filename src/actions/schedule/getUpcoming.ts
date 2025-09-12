import { api } from '@/services/api'

export async function getUpcomingSchedules() {
    const response = await api.get('/schedules/upcoming')
    return response.data
}
