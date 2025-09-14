export type { User } from './auth'
import type { User as UserType } from './auth'

export interface Address {
    zipCode: string
    street: string
    number: string
    district: string
    city: string
    state: string
    complement?: string
}

export interface UserWithAddress extends Omit<UserType, 'address'> {
    address?: Address
}