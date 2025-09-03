import { X } from "lucide-react"
import { Button } from "../ui/button"
import schedules from "@/mocks/schedule-customer"



export function ScheduleTable() {
    return (
        <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-gray-200 rounded-lg shadow-sm">
                <thead className="border-b">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Data agendamento</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sala de agendamento</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status transação</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {schedules.map((schedule) => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">{schedule.date}</td>
                            <td className="px-4 py-3">
                                <div>
                                    <span className="text-base font-medium text-gray-900">{schedule.name}</span>
                                    <p className="text-xs text-gray-500">{schedule.role}</p>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="gap-1 inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-black rounded-full">
                                    Sala <strong>{schedule.room}</strong>
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="gap-1 inline-flex items-center justify-center px-6 py-1.5 text-sm font-medium text-zinc-600 border border-zinc-300 rounded-full">
                                    {schedule.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <Button size="icon" className="rounded-full">
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
