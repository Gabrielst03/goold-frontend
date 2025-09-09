import { cn } from "@/lib/utils"

interface ScheduleBadgeProps {
    status: 'pending' | 'confirmed' | 'cancelled'
    className?: string
}

export function ScheduleBadge({ status, className }: ScheduleBadgeProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'confirmed':
                return {
                    text: 'Agendado',
                    className: 'text-[#10C3A9] border border-[#10C3A9] bg-[#DBFFFA]'
                }
            case 'cancelled':
                return {
                    text: 'Cancelado',
                    className: 'text-red-600 border border-red-300 bg-red-50'
                }
            case 'pending':
            default:
                return {
                    text: 'Em análise',
                    className: 'text-zinc-500 border border-zinc-300'
                }
        }
    }

    const config = getStatusConfig(status)

    return (
        <span className={cn(
            "gap-1 inline-flex items-center justify-center px-6 py-1.5 text-sm font-medium rounded-full",
            config.className,
            className
        )}>
            {config.text}
        </span>
    )
}
