import { api } from '@/services/api'

export async function deleteSchedule(id: number) {
    const response = await api.delete(`/schedules/${id}`)
    return response.data
}
