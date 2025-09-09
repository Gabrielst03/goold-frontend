'use client'
import { X } from "lucide-react"
import { Button } from "../ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../ui/alert-dialog"
import { useMySchedules, useCancelSchedule } from "@/hooks/useSchedules"
import { useAuth } from "@/contexts/AuthContext"
import { format } from "date-fns"
import { dateLocale } from "@/lib/date-config"
import { toast } from "react-toastify"
import { ScheduleBadge } from "./ScheduleBadge"

export function ScheduleTable() {
    const { user } = useAuth()
    const { data: schedules = [], isLoading, error } = useMySchedules()
    const cancelScheduleMutation = useCancelSchedule()

    const handleCancelSchedule = async (scheduleId: number) => {
        try {
            await cancelScheduleMutation.mutateAsync(scheduleId)

            toast.success("Agendamento cancelado com sucesso!", {
                position: "top-right",
                autoClose: 3000
            })
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error)
            toast.error("Erro ao cancelar agendamento. Tente novamente.", {
                position: "top-right",
                autoClose: 4000
            })
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
                                <ScheduleBadge status={schedule.status} />
                            </td>
                            <td className="px-4 py-3">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="rounded-full"
                                            disabled={schedule.status === 'cancelled' || cancelScheduleMutation.isPending}
                                            variant={schedule.status === 'cancelled' ? 'outline' : 'default'}
                                        >
                                            <X />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Não, manter agendamento</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleCancelSchedule(schedule.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Sim, cancelar agendamento
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
