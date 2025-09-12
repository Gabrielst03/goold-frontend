import { api } from '@/services/api'

export async function getRoomById(id: number) {
    const response = await api.get(`/rooms/${id}`)
    return response.data
}
