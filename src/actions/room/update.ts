import { api } from '@/services/api'
import { UpdateRoomRequest } from '@/types/room'

export async function updateRoom(id: number, data: UpdateRoomRequest) {
    const response = await api.put(`/rooms/${id}`, data)
    return response.data
}
