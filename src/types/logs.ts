export interface Log {
    id: number
    userId: number
    module: 'Account' | 'Schedule' | 'Auth'
    activityDate: string
    activityType: string
    createdAt: string
    updatedAt: string
    user?: {
        id: number
        firstName: string
        lastName: string
        email: string
        accountType: 'customer' | 'admin'
    }
}

export interface LogsResponse {
    total: number
    logs: Log[]
}

export interface CreateLogRequest {
    module: 'Account' | 'Schedule' | 'Auth'
    activityType: string
}
