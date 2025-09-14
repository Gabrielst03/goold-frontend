import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/actions/user'
import { User } from '@/types/auth'

export function useUsers() {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 2 * 60 * 1000, // 2 minutos
        retry: 3,
    })
}

