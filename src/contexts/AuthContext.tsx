'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, AuthContextType, LoginRequest, SignUpRequest } from '@/types/auth'
import { authAPI } from '@/services/api'
import { useRouter } from 'next/navigation'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasVerifiedProfile, setHasVerifiedProfile] = useState(false)
    const router = useRouter()

    const isAuthenticated = !!user && !!token

    const logout = useCallback(() => {
        localStorage.removeItem('@goold:token')
        localStorage.removeItem('@goold:user')

        setToken(null)
        setUser(null)
        setHasVerifiedProfile(false)

        router.push('/signin')
    }, [router])

    const getProfile = useCallback(async () => {
        try {
            const userData = await authAPI.getProfile()
            setUser(userData)
            localStorage.setItem('@goold:user', JSON.stringify(userData))
        } catch (error) {
            console.error('Erro ao buscar perfil:', error)
            throw error
        }
    }, [])

    useEffect(() => {
        const storedToken = localStorage.getItem('@goold:token')
        const storedUser = localStorage.getItem('@goold:user')

        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error('Erro ao carregar dados do localStorage:', error)
                logout()
            }
        }
        setIsLoading(false)
    }, [logout])

    // Verificar se o token ainda é válido apenas uma vez
    useEffect(() => {
        if (token && !isLoading && !hasVerifiedProfile) {
            setHasVerifiedProfile(true)
            getProfile().catch(() => {
                logout()
            })
        }
    }, [token, isLoading, hasVerifiedProfile, getProfile, logout])

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            const currentPath = window.location.pathname
            if (currentPath === '/signin' || currentPath === '/signup') {
                router.push('/')
            }
        }
    }, [isAuthenticated, isLoading, router])

    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true)
            const response = await authAPI.login(credentials)

            const { token: authToken, user: userData } = response

            localStorage.setItem('@goold:token', authToken)
            localStorage.setItem('@goold:user', JSON.stringify(userData))

            setToken(authToken)
            setUser(userData)
            setHasVerifiedProfile(true) // Já temos dados válidos do login

            router.push('/')
        } catch (error: unknown) {
            console.error('Erro no login:', error)
            let errorMessage = 'Erro ao fazer login'
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                errorMessage = axiosError.response?.data?.message || errorMessage
            }
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const signup = async (userData: SignUpRequest) => {
        try {
            setIsLoading(true)

            await authAPI.signup(userData)

            await login({
                email: userData.email,
                password: userData.password
            })
        } catch (error: unknown) {
            console.error('Erro no cadastro:', error)
            let errorMessage = 'Erro ao criar conta'
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                errorMessage = axiosError.response?.data?.message || errorMessage
            }
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        getProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
}
