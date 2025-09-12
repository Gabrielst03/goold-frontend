import { api } from '@/services/api'

export async function deleteRoom(id: number) {
    const response = await api.delete(`/rooms/${id}`)
    return response.data
}
