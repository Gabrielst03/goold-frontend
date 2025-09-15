'use client'

import { Sidebar } from '@/components/ui/sidebar'
import { Header } from '@/components/ui/header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { UsersTable } from '@/components/users/UsersTable'

export default function ClientesPage() {
    const { user } = useAuth()

    if (user?.accountType !== 'admin') {
        return (
            <ProtectedRoute>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-lg text-gray-500">Acesso restrito para administradores.</p>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className='flex min-h-screen'>
                <Sidebar />
                <div className='flex flex-col min-h-screen w-full ml-64'>
                    <Header title="Clientes" description="Lista de todos os usuários cadastrados no sistema." />
                    <div className='flex flex-col mt-8 mx-9'>
                        <UsersTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}


