'use client'
import { Room } from "@/mocks/rooms"
import { MapPin, Users, Wifi } from "lucide-react"

interface RoomCardProps {
    room: Room
    selected?: boolean
    onClick?: () => void
}

export function RoomCard({ room, selected, onClick }: RoomCardProps) {
    return (
        <div
            className={`p-3 border rounded-md cursor-pointer transition-all hover:bg-accent ${selected ? 'border-primary bg-primary/5' : 'border-border'
                }`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                    <h4 className="font-medium text-sm">{room.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{room.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{room.capacity} pessoas</span>
                        </div>
                    </div>
                    {room.description && (
                        <p className="text-xs text-muted-foreground">{room.description}</p>
                    )}
                    {room.equipment.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                            <Wifi className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {room.equipment.slice(0, 2).join(', ')}
                                {room.equipment.length > 2 && ` +${room.equipment.length - 2}`}
                            </span>
                        </div>
                    )}
                </div>
                {selected && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                )}
            </div>
        </div>
    )
}
