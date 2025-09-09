'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredAccountType?: 'customer' | 'admin'
}

export function ProtectedRoute({ children, requiredAccountType }: ProtectedRouteProps) {
    const { isAuthenticated, user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/signin')
                return
            }

            if (requiredAccountType && user?.accountType !== requiredAccountType) {
                router.push('/unauthorized')
                return
            }
        }
    }, [isAuthenticated, user, isLoading, router, requiredAccountType])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    if (requiredAccountType && user?.accountType !== requiredAccountType) {
        return null
    }

    return <>{children}</>
}
