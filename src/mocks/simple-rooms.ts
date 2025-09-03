export interface SimpleRoom {
    id: string
    name: string
    available: boolean
}

export const simpleRooms: SimpleRoom[] = [
    { id: "1", name: "Sala 1", available: true },
    { id: "2", name: "Sala 2", available: true },
    { id: "3", name: "Sala 3", available: true },
    { id: "4", name: "Sala 4", available: true },
    { id: "5", name: "Sala 5", available: false },
    { id: "6", name: "Sala 6", available: true },
    { id: "7", name: "Sala 7", available: true },
    { id: "8", name: "Sala 8", available: true },
    { id: "9", name: "Sala 9", available: true },
    { id: "10", name: "Sala 10", available: true }
]

export const getAvailableSimpleRooms = (): SimpleRoom[] => {
    return simpleRooms.filter(room => room.available)
}

export const getSimpleRoomById = (id: string): SimpleRoom | undefined => {
    return simpleRooms.find(room => room.id === id)
}
