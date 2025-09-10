'use client'
import { LogsTable } from "@/components/logs/LogsTable"
import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'

export default function LogsPage() {
    const { user } = useAuth()
    const isAdmin = user?.accountType === 'admin'

    return (
        <ProtectedRoute>
            <div className='flex min-h-screen'>
                <Sidebar />

                <div className='flex flex-col min-h-screen w-full'>
                    <Header
                        title={isAdmin ? "Logs do Sistema" : "Meus Logs"}
                        description={isAdmin ? "Visualize todas as atividades e eventos do sistema" : "Visualize suas atividades e eventos no sistema"}
                    />

                    <div className='flex flex-col mt-8 mx-9'>
                        <LogsTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
