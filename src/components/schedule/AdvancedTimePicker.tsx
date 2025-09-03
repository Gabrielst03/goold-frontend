'use client'
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

export interface TimeSlot {
    time: string
    available: boolean
    label?: string
}

export interface AdvancedTimePickerProps {
    value?: string
    onSelect?: (time: string) => void
    className?: string
    timeSlots?: TimeSlot[]
    startHour?: number
    endHour?: number
    interval?: number
    unavailableTimes?: string[]
}

const generateTimeSlots = (
    startHour: number = 8,
    endHour: number = 18,
    interval: number = 30,
    unavailableTimes: string[] = []
): TimeSlot[] => {
    const slots: TimeSlot[] = []

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            if (hour === endHour && minute > 0) break

            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            const available = !unavailableTimes.includes(timeString)

            slots.push({
                time: timeString,
                available,
                label: timeString
            })
        }
    }

    return slots
}

export function AdvancedTimePicker({
    value,
    onSelect,
    className,
    timeSlots,
    startHour = 8,
    endHour = 18,
    interval = 30,
    unavailableTimes = []
}: AdvancedTimePickerProps) {
    const slots = timeSlots || generateTimeSlots(startHour, endHour, interval, unavailableTimes)

    const morningSlots = slots.filter(slot => {
        const hour = parseInt(slot.time.split(':')[0])
        return hour < 12
    })

    const afternoonSlots = slots.filter(slot => {
        const hour = parseInt(slot.time.split(':')[0])
        return hour >= 12
    })

    const renderTimeSlots = (slotsToRender: TimeSlot[], title: string) => (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4" />
                {title}
            </div>
            <div className="grid grid-cols-4 gap-2">
                {slotsToRender.map((slot) => {
                    const isSelected = value === slot.time
                    const isAvailable = slot.available

                    return (
                        <Button
                            key={slot.time}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            disabled={!isAvailable}
                            className={cn(
                                "h-10 text-sm transition-all",
                                isSelected && "bg-primary text-primary-foreground shadow-md",
                                !isAvailable && "opacity-40 cursor-not-allowed bg-muted",
                                isAvailable && !isSelected && "hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => isAvailable && onSelect?.(slot.time)}
                        >
                            {slot.label || slot.time}
                        </Button>
                    )
                })}
            </div>
        </div>
    )

    return (
        <div className={cn("p-4 space-y-6 max-h-[400px] overflow-y-auto", className)}>
            {morningSlots.length > 0 && renderTimeSlots(morningSlots, "Manhã")}
            {afternoonSlots.length > 0 && renderTimeSlots(afternoonSlots, "Tarde")}

            {slots.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhum horário disponível</p>
                </div>
            )}
        </div>
    )
}
