import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/actions/user'

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.setQueryData(['users', data.id], data)
        },
        onError: (error: Error) => {
            console.error('Erro ao atualizar usuário:', error.message)
        },
    })
}   