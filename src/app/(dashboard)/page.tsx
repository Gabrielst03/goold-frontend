'use client'
import { Schedule } from '@/components/schedule/Schedule'
import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'

export default function Page() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className='flex min-h-screen'>
        <Sidebar />

        <div className='flex flex-col min-h-screen w-full ml-64'>
          <Header
            title={`Bem-vindo, ${user?.firstName}!`}
            description='Acompanhe todos os seus agendamentos de forma simples.'
          />

          <div className='flex flex-col mt-8 mx-9'>
            <Schedule />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
