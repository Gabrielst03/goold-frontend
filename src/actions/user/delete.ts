import { api } from '@/services/api'

export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
}
