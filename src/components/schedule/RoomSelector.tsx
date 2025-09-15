'use client'
import { useState } from "react"
import { useAvailableRooms } from "@/hooks/useRooms"
import { RoomCard } from "./RoomCard"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Room } from "@/types/room"

interface RoomSelectorProps {
    value?: string
    onSelect?: (roomId: string) => void
    className?: string
}

export function RoomSelector({ value, onSelect, className }: RoomSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const { data: availableRooms = [], isLoading, error } = useAvailableRooms()

    const filteredRooms = availableRooms.filter((room: Room) =>
        room.number.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className={`space-y-4 p-4 ${className}`}>
                <div className="space-y-2">
                    <Input placeholder="Buscar salas..." disabled />
                    <p className="text-sm text-muted-foreground">Carregando salas...</p>
                </div>
                <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`space-y-4 p-4 ${className}`}>
                <div className="space-y-2">
                    <Input placeholder="Buscar salas..." disabled />
                    <p className="text-sm text-red-500">Erro ao carregar salas</p>
                </div>
                <div className="text-center text-red-500 py-8">
                    <p>Erro ao carregar as salas</p>
                    <p className="text-sm">Tente novamente mais tarde</p>
                </div>
            </div>
        )
    }

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
                    {filteredRooms.map((room: Room) => (
                        <RoomCard
                            key={room.id}
                            room={{
                                id: room.id.toString(),
                                name: `Sala ${room.number}`,
                                available: room.availability
                            }}
                            selected={value === room.id.toString()}
                            onClick={() => onSelect?.(room.id.toString())}
                        />
                    ))}
                </div>
            </ScrollArea>

            {filteredRooms.length === 0 && !isLoading && (
                <div className="text-center text-muted-foreground py-8">
                    <p>Nenhuma sala encontrada</p>
                    <p className="text-sm">Tente ajustar sua busca</p>
                </div>
            )}
        </div>
    )
}
