import axios from 'axios'
import { AuthResponse, LoginRequest, SignUpRequest, User } from '@/types/auth'
import { Room, CreateRoomRequest, UpdateRoomRequest } from '@/types/room'
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, UpdateScheduleStatusRequest } from '@/types/schedule'
import { Log, LogsResponse, CreateLogRequest } from '@/types/logs'

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@goold:token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('@goold:token')
            localStorage.removeItem('@goold:user')
            window.location.href = '/signin'
        }
        return Promise.reject(error)
    }
)

export const authAPI = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', credentials)
        return response.data
    },

    signup: async (userData: SignUpRequest): Promise<User> => {
        const response = await api.post('/users', userData)
        return response.data
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/profile')
        return response.data
    }
}

// Room API functions
export const roomAPI = {
    getRooms: async (): Promise<Room[]> => {
        const response = await api.get('/rooms')
        return response.data
    },

    getAvailableRooms: async (): Promise<Room[]> => {
        const response = await api.get('/rooms/available')
        return response.data
    },

    getRoomById: async (id: number): Promise<Room> => {
        const response = await api.get(`/rooms/${id}`)
        return response.data
    },

    createRoom: async (data: CreateRoomRequest): Promise<Room> => {
        const response = await api.post('/rooms', data)
        return response.data
    },

    updateRoom: async (id: number, data: UpdateRoomRequest): Promise<Room> => {
        const response = await api.put(`/rooms/${id}`, data)
        return response.data
    },

    updateRoomAvailability: async (id: number, availability: boolean): Promise<Room> => {
        const response = await api.patch(`/rooms/${id}/availability`, { availability })
        return response.data
    },

    deleteRoom: async (id: number): Promise<void> => {
        await api.delete(`/rooms/${id}`)
    }
}

export const scheduleAPI = {
    getSchedules: async (): Promise<Schedule[]> => {
        const response = await api.get('/schedules')
        return response.data
    },

    getMySchedules: async (): Promise<Schedule[]> => {
        const response = await api.get('/schedules/my-schedules')
        return response.data
    },

    getUpcomingSchedules: async (): Promise<Schedule[]> => {
        const response = await api.get('/schedules/upcoming')
        return response.data
    },

    getScheduleById: async (id: number): Promise<Schedule> => {
        const response = await api.get(`/schedules/${id}`)
        return response.data
    },

    createSchedule: async (data: CreateScheduleRequest): Promise<Schedule> => {
        const response = await api.post('/schedules', data)
        return response.data
    },

    updateSchedule: async (id: number, data: UpdateScheduleRequest): Promise<Schedule> => {
        const response = await api.put(`/schedules/${id}`, data)
        return response.data
    },

    updateScheduleStatus: async (id: number, data: UpdateScheduleStatusRequest): Promise<Schedule> => {
        const response = await api.patch(`/schedules/${id}/status`, data)
        return response.data
    },

    cancelSchedule: async (id: number): Promise<{ message: string; schedule: Schedule }> => {
        const response = await api.patch(`/schedules/${id}/cancel`)
        return response.data
    },

    deleteSchedule: async (id: number): Promise<{ message: string }> => {
        const response = await api.delete(`/schedules/${id}`)
        return response.data
    }
}

export const logsAPI = {
    getLogs: async (): Promise<LogsResponse> => {
        const response = await api.get('/logs')
        return response.data
    },

    getMyLogs: async (): Promise<LogsResponse> => {
        const response = await api.get('/logs/my')
        return response.data
    },

    getLogsByModule: async (module: string): Promise<LogsResponse> => {
        const response = await api.get(`/logs/module/${module}`)
        return response.data
    },

    createLog: async (data: CreateLogRequest): Promise<Log> => {
        const response = await api.post('/logs', data)
        return response.data
    }
}