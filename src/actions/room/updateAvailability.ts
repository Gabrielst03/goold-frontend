import { api } from '@/services/api'

export async function updateRoomAvailability(id: number, availability: boolean) {
    const response = await api.patch(`/rooms/${id}/availability`, { availability })
    return response.data
}
