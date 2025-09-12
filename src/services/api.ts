import axios from 'axios'
import { AuthResponse, LoginRequest, SignUpRequest, User } from '@/types/auth'


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

