import { api } from '@/services/api'

export async function getLogsByModule(module: string, page: number = 1, limit: number = 10) {
    const response = await api.get(`/logs/module/${module}`, { params: { page, limit } })
    return response.data
}
