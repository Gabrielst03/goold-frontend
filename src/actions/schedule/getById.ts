import { api } from '@/services/api'

export async function getScheduleById(id: number) {
    const response = await api.get(`/schedules/${id}`)
    return response.data
}
