import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserStatus } from '@/actions/user'

export function useUpdateUserStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            console.log('Status do usuário atualizado com sucesso!')
        },
        onError: (error: Error) => {
            console.error('Erro ao atualizar status do usuário:', error.message)
        },
    })
}
