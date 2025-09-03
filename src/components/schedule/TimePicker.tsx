'use client'
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

export interface TimePickerProps {
    value?: string
    onSelect?: (time: string) => void
    className?: string
    disabledTimes?: string[]
}

const generateTimeSlots = (): string[] => {
    const times: string[] = []
    for (let hour = 8; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 18 && minute > 0) break
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            times.push(timeString)
        }
    }
    return times
}

export function TimePicker({ value, onSelect, className, disabledTimes = [] }: TimePickerProps) {
    const timeSlots = generateTimeSlots()

    return (
        <div className={cn("grid grid-cols-3 gap-2 p-4 max-h-[300px] overflow-y-auto", className)}>
            {timeSlots.map((time) => {
                const isSelected = value === time
                const isDisabled = disabledTimes.includes(time)

                return (
                    <Button
                        key={time}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        disabled={isDisabled}
                        className={cn(
                            "h-10 text-sm",
                            isSelected && "bg-primary text-primary-foreground",
                            isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => onSelect?.(time)}
                    >
                        {time}
                    </Button>
                )
            })}
        </div>
    )
}
