'use client'
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { useMySchedules, useCancelSchedule } from "@/hooks/useSchedules"
import { useAuth } from "@/contexts/AuthContext"
import { format } from "date-fns"
import { dateLocale } from "@/lib/date-config"

export function ScheduleTable() {
    const { user } = useAuth()
    const { data: schedules = [], isLoading, error } = useMySchedules()
    const cancelScheduleMutation = useCancelSchedule()

    const handleCancelSchedule = async (scheduleId: number) => {
        try {
            await cancelScheduleMutation.mutateAsync(scheduleId)
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="mt-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-6 text-center text-red-500 py-8">
                <p>Erro ao carregar agendamentos</p>
                <p className="text-sm">Tente novamente mais tarde</p>
            </div>
        )
    }

    if (schedules.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-500 py-8">
                <p>Nenhum agendamento encontrado</p>
                <p className="text-sm">Crie seu primeiro agendamento usando o botão acima</p>
            </div>
        )
    }

    return (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-gray-200 rounded-lg shadow-sm">
                <thead className="border-b">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Data agendamento</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sala de agendamento</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">
                                {format(new Date(schedule.scheduleDate), "dd/MM/yyyy 'às' HH:mm", { locale: dateLocale })}
                            </td>
                            <td className="px-4 py-3">
                                <div>
                                    <span className="text-base font-medium text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {user?.accountType === 'customer' ? 'Cliente' : 'Administrador'}
                                    </p>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="gap-1 inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-black rounded-full">
                                    Sala <strong>{schedule.room?.number || schedule.roomId}</strong>
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`gap-1 inline-flex items-center justify-center px-6 py-1.5 text-sm font-medium rounded-full ${schedule.status === 'confirmed'
                                    ? 'text-green-600 border border-green-300 bg-green-50'
                                    : schedule.status === 'cancelled'
                                        ? 'text-red-600 border border-red-300 bg-red-50'
                                        : 'text-yellow-600 border border-yellow-300 bg-yellow-50'
                                    }`}>
                                    {schedule.status === 'confirmed' ? 'Confirmado' :
                                        schedule.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <Button
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => handleCancelSchedule(schedule.id)}
                                    disabled={schedule.status === 'cancelled' || cancelScheduleMutation.isPending}
                                    variant={schedule.status === 'cancelled' ? 'outline' : 'default'}
                                >
                                    <X />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
