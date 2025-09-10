import { cn } from "@/lib/utils"
import { Calendar, CalendarClockIcon, Lock, User } from "lucide-react"

interface ModuleBadgeProps {
    text: string
    className?: string
}

export function ModuleBadge({ text, className }: ModuleBadgeProps) {
    const moduleConfig = {
        'Schedule': {
            label: 'Agendamento',
            icon: CalendarClockIcon
        },
        'Auth': {
            label: 'Autenticação',
            icon: Lock
        },
        'Account': {
            label: 'Minha Conta',
            icon: User
        }
    }

    const config = moduleConfig[text as keyof typeof moduleConfig] || {
        label: text,
        icon: null
    }

    const Icon = config.icon

    return (
        <span className={cn(
            "gap-1 inline-flex items-center justify-center px-6 py-1.5 text-sm font-medium rounded-full",
            "text-black border border-zinc-400 bg-[#F6F4F1]",
            className
        )}>
            {Icon && <Icon className="w-4 h-4" style={{ marginRight: '4px' }} />}
            {config.label}
        </span>
    )
}
