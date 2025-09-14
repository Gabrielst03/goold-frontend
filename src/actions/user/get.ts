import { api } from '@/services/api'
import { User } from '@/types/auth'

export async function getUsers(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
}
