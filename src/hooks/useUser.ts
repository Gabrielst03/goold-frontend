import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/actions/user'
import { User } from '@/types/auth'

export function useUser(id: number) {
    return useQuery<User>({
        queryKey: ['users', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutos
    })
}
