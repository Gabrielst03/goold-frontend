import { Room } from './room'

export interface Schedule {
    id: number
    scheduleDate: string
    userId: number
    roomId: number
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: string
    updatedAt: string
    room?: Room
    user?: {
        id: number
        firstName: string
        lastName: string
        email: string
        accountType: 'customer' | 'admin'
    }
}

export interface CreateScheduleRequest {
    scheduleDate: string
    roomId: number
}

export interface UpdateScheduleRequest {
    scheduleDate?: string
    roomId?: number
}

export interface UpdateScheduleStatusRequest {
    status: 'pending' | 'confirmed' | 'cancelled'
}
