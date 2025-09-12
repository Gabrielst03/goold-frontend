import { api } from '@/services/api'

export async function getAvailableRooms() {
    const response = await api.get('/rooms/available')
    return response.data
}
