export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    accountType: 'customer' | 'admin'
    status: boolean
    address?: {
        zipCode: string
        street: string
        number: string
        district: string
        city: string
        state: string
        complement?: string
    }
    createdAt: string
    updatedAt: string
}

export interface AuthResponse {
    message: string
    token: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignUpRequest {
    firstName: string
    lastName: string
    email: string
    password: string
    accountType: 'customer'
    address: {
        zipCode: string
        street: string
        number: string
        district: string
        city: string
        state: string
        complement?: string
    }
}

export interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: LoginRequest) => Promise<void>
    signup: (userData: SignUpRequest) => Promise<void>
    logout: () => void
    getProfile: () => Promise<void>
}
