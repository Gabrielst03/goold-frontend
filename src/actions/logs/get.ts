import { api } from '@/services/api'

export async function getLogs(page: number = 1, limit: number = 10) {
    const response = await api.get('/logs', { params: { page, limit } })
    return response.data
}
