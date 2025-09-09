export interface Room {
    id: number
    number: string
    availability: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateRoomRequest {
    number: string
}

export interface UpdateRoomRequest {
    number?: string
    availability?: boolean
}
