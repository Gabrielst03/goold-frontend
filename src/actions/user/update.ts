import { api } from '@/services/api'
import { User } from '@/types/auth'

interface Address {
    zipCode: string
    street: string
    number: string
    district: string
    city: string
    state: string
    complement?: string
}

interface UpdateUserData {
    id: number
    firstName?: string
    lastName?: string
    email?: string
    accountType?: 'admin' | 'customer'
    address?: Address | string
}

export async function updateUser({ id, ...data }: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data)
    return response.data
}
