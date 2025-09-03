import { Schedule } from '@/components/schedule/Schedule'
import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'
import React from 'react'

export default function Page() {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <div className='flex flex-col min-h-screen w-full'>
        <Header title='Agendamento' description='Acompanhe todos os seus agendamentos de forma simples.' />

        <div className='flex flex-col mt-8 mx-9'>
          <Schedule />
        </div>
      </div>

    </div>
  )
}
