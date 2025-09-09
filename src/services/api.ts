import axios from 'axios'
import { AuthResponse, LoginRequest, SignUpRequest, User } from '@/types/auth'
import { Room, CreateRoomRequest, UpdateRoomRequest } from '@/types/room'

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