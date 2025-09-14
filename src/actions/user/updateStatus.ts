import { api } from '@/services/api'

interface UpdateUserStatusData {
    id: number
    isActive: boolean
}

export async function updateUserStatus({ id, isActive }: UpdateUserStatusData): Promise<void> {
    await api.patch(`/users/${id}/status`, { isActive })
}
