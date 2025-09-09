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
