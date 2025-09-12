import { api } from '@/services/api'

export async function cancelSchedule(id: number) {
    const response = await api.patch(`/schedules/${id}/cancel`)
    return response.data
}
