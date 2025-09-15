export interface Room {
    id: number
    number: string
    availability: boolean
    startTime?: string
    endTime?: string
    intervalMinutes?: number
    createdAt: string
    updatedAt: string
}

export interface CreateRoomRequest {
    number: string
    startTime: string
    endTime: string
    intervalMinutes: number
}

export interface UpdateRoomRequest {
    number?: string
    availability?: boolean
    startTime?: string
    endTime?: string
    intervalMinutes?: number
}
