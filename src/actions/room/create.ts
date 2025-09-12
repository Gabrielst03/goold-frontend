import { api } from '@/services/api'
import { CreateRoomRequest } from '@/types/room'

export async function createRoom(data: CreateRoomRequest) {
    const response = await api.post('/rooms', data)
    return response.data
}
