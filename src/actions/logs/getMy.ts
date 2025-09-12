import { api } from '@/services/api'

export async function getMyLogs(page: number = 1, limit: number = 10) {
    const response = await api.get('/logs/my', { params: { page, limit } })
    return response.data
}
