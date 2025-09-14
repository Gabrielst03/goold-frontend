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

interface CreateUserData {
    firstName: string
    lastName: string
    email: string
    password: string
    accountType: 'admin' | 'customer'
    address?: Address | string
}

export async function createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data)
    return response.data
}
