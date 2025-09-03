'use client'
import { useState } from "react"
import { Room, getAvailableRooms } from "@/mocks/rooms"
import { RoomCard } from "./RoomCard"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"

interface RoomSelectorProps {
    value?: string
    onSelect?: (roomId: string) => void
    className?: string
}

export function RoomSelector({ value, onSelect, className }: RoomSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const availableRooms = getAvailableRooms()

    const filteredRooms = availableRooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className={`space-y-4 p-4 ${className}`}>
            <div className="space-y-2">
                <Input
                    placeholder="Buscar salas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    showSearchIcon
                />
                <p className="text-sm text-muted-foreground">
                    {filteredRooms.length} sala{filteredRooms.length !== 1 ? 's' : ''} disponível{filteredRooms.length !== 1 ? 'is' : ''}
                </p>
            </div>

            <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                    {filteredRooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            selected={value === room.id}
                            onClick={() => onSelect?.(room.id)}
                        />
                    ))}
                </div>
            </ScrollArea>

            {filteredRooms.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>Nenhuma sala encontrada</p>
                    <p className="text-sm">Tente ajustar sua busca</p>
                </div>
            )}
        </div>
    )
}
