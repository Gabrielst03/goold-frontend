import { cn } from "@/lib/utils"

interface ModuleBadgeProps {
    text: string
    className?: string
}

export function ModuleBadge({ text, className }: ModuleBadgeProps) {
    return (
        <span className={cn(
            "gap-1 inline-flex items-center justify-center px-6 py-1.5 text-sm font-medium rounded-full",
            "text-black border border-zinc-400 bg-[#F6F4F1]",
            className
        )}>
            {text}
        </span>
    )
}
