'use client'
import { MapPin, Users, Wifi } from "lucide-react"

interface RoomCardRoom {
    id: string
    name: string
    location?: string
    capacity?: number
    description?: string
    amenities?: string[]
    available: boolean
}

interface RoomCardProps {
    room: RoomCardRoom
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
                        {room.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{room.location}</span>
                            </div>
                        )}
                        {room.capacity && (
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{room.capacity} pessoas</span>
                            </div>
                        )}
                    </div>
                    {room.description && (
                        <p className="text-xs text-muted-foreground">{room.description}</p>
                    )}
                    {room.amenities && room.amenities.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                            <Wifi className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {room.amenities.slice(0, 2).join(', ')}
                                {room.amenities.length > 2 && ` +${room.amenities.length - 2}`}
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
