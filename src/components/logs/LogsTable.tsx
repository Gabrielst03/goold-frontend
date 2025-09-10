'use client'
import { useLogs } from "@/hooks/useLogs"
import { useAuth } from "@/contexts/AuthContext"
import { format } from "date-fns"
import { dateLocale } from "@/lib/date-config"
import { LogBadge } from "./LogBadge"
import { ModuleBadge } from "./ModuleBadge"

export function LogsTable() {
    const { user } = useAuth()
    const { data: logsData, isLoading, error } = useLogs()

    const logs = logsData?.logs || []
    const isAdmin = user?.accountType === 'admin'

    if (!isAdmin) {
        return (
            <div className="mt-6 text-center text-red-500 py-8">
                <p>Acesso negado</p>
                <p className="text-sm">Apenas administradores podem visualizar os logs do sistema</p>
            </div>
        )
    } if (isLoading) {
        return (
            <div className="mt-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-6 text-center text-red-500 py-8">
                <p>Erro ao carregar logs</p>
                <p className="text-sm">Tente novamente mais tarde</p>
            </div>
        )
    }

    if (logs.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-500 py-8">
                <p>Nenhum log encontrado</p>
                <p className="text-sm">Os logs aparecerão aqui quando houver atividade no sistema</p>
            </div>
        )
    }

    return (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-gray-200 rounded-lg shadow-sm">
                <thead className="border-b">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cliente</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo de Atividade</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Módulo</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Data</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="flex flex-col px-4 py-3">
                                <p className="font-medium text-base">
                                    {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Usuário não encontrado'}
                                </p>
                                <span className="text-sm text-gray-500">
                                    {log?.user?.accountType === 'admin' ? 'Administrador' : 'Cliente'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <LogBadge text={log.activityType} />
                            </td>
                            <td className="px-4 py-3">
                                <ModuleBadge text={log.module} />
                            </td>
                            <td className="px-4 py-3">
                                <LogBadge text={format(new Date(log.activityDate), "dd/MM/yyyy 'às' HH:mm", { locale: dateLocale })} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
