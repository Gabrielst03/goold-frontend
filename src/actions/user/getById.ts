import { api } from '@/services/api'
import { User } from '@/types/auth'

export async function getUserById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
}
