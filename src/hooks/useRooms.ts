import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomAPI } from '@/services/api'
import { Room, CreateRoomRequest, UpdateRoomRequest } from '@/types/room'

export const roomKeys = {
    all: ['rooms'] as const,
    lists: () => [...roomKeys.all, 'list'] as const,
    list: (filters: string) => [...roomKeys.lists(), { filters }] as const,
    details: () => [...roomKeys.all, 'detail'] as const,
    detail: (id: number) => [...roomKeys.details(), id] as const,
    available: () => [...roomKeys.all, 'available'] as const,
}

export function useRooms() {
    return useQuery({
        queryKey: roomKeys.lists(),
        queryFn: roomAPI.getRooms,
        staleTime: 5 * 60 * 1000, // 5 minutos
    })
}

export function useAvailableRooms() {
    return useQuery({
        queryKey: roomKeys.available(),
        queryFn: roomAPI.getAvailableRooms,
        staleTime: 2 * 60 * 1000, // 2 minutos
    })
}

export function useRoom(id: number) {
    return useQuery({
        queryKey: roomKeys.detail(id),
        queryFn: () => roomAPI.getRoomById(id),
        enabled: !!id,
    })
}

export function useCreateRoom() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRoomRequest) => roomAPI.createRoom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roomKeys.all })
        },
    })
}

export function useUpdateRoom() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRoomRequest }) =>
            roomAPI.updateRoom(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: roomKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: roomKeys.lists() })
            queryClient.invalidateQueries({ queryKey: roomKeys.available() })
        },
    })
}

export function useUpdateRoomAvailability() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, availability }: { id: number; availability: boolean }) =>
            roomAPI.updateRoomAvailability(id, availability),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: roomKeys.detail(id) })
            queryClient.invalidateQueries({ queryKey: roomKeys.lists() })
            queryClient.invalidateQueries({ queryKey: roomKeys.available() })
        },
    })
}

export function useDeleteRoom() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => roomAPI.deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roomKeys.all })
        },
    })
}
