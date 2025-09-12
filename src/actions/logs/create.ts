import { api } from '@/services/api'
import { CreateLogRequest } from '@/types/logs'

export async function createLog(data: CreateLogRequest) {
    const response = await api.post('/logs', data)
    return response.data
}
