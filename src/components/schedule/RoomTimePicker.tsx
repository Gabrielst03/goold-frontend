'use client'
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Room } from "@/types/room"

export interface RoomTimePickerProps {
    room?: Room
    value?: string
    onSelect?: (time: string) => void
    className?: string
    disabledTimes?: string[]
}

const generateTimeSlots = (room?: Room): string[] => {
    if (!room || !room.startTime || !room.endTime || !room.intervalMinutes) {
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

    const times: string[] = []

    const [startHour, startMinute] = room.startTime.split(':').map(Number)
    const [endHour, endMinute] = room.endTime.split(':').map(Number)

    const startDate = new Date()
    startDate.setHours(startHour, startMinute, 0, 0)

    const endDate = new Date()
    endDate.setHours(endHour, endMinute, 0, 0)

    const intervalMs = room.intervalMinutes * 60 * 1000

    let currentTime = new Date(startDate)

    while (currentTime < endDate) {
        const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`
        times.push(timeString)

        currentTime = new Date(currentTime.getTime() + intervalMs)
    }

    return times
}

export function RoomTimePicker({ room, value, onSelect, className, disabledTimes = [] }: RoomTimePickerProps) {
    const timeSlots = generateTimeSlots(room)

    if (!room) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Selecione uma sala primeiro</p>
            </div>
        )
    }

    if (!room.startTime || !room.endTime) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Esta sala não tem horários configurados</p>
            </div>
        )
    }

    return (
        <div className={cn("p-4", className)}>
            <div className="mb-3 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                <strong>Sala {room.number}:</strong> {room.startTime} - {room.endTime}
                <br />
                <strong>Intervalos:</strong> {room.intervalMinutes} minutos
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
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

            {timeSlots.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    <p>Nenhum horário disponível para esta sala</p>
                </div>
            )}
        </div>
    )
}