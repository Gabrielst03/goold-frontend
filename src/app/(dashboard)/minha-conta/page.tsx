'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sidebar } from '@/components/ui/sidebar'
import { Header } from '@/components/ui/header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useUpdateUser } from '@/hooks/useUpdateUser'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { searchCep, formatCep } from '@/utils/functions/search-cep'
import { toast } from 'react-toastify'

const updateAccountSchema = z.object({
    firstName: z.string().min(2, 'Você precisa informar seu nome.'),
    lastName: z.string().min(2, 'Você precisa informar seu sobrenome.'),
    email: z.string().email('Você precisa inserir um e-mail válido.'),
    address: z.object({
        zipCode: z.string().min(8, 'CEP deve ter 8 dígitos.').max(9, 'CEP inválido.'),
        street: z.string().min(1, 'Você precisa informar sua rua.'),
        number: z.string().min(1, 'Você precisa informar o número.'),
        district: z.string().min(2, 'Você precisa informar seu bairro.'),
        city: z.string().min(2, 'Você precisa informar sua cidade.'),
        state: z.string().min(2, 'Você precisa informar seu estado.'),
        complement: z.string().optional()
    })
})

type UpdateAccountFormData = z.infer<typeof updateAccountSchema>

export default function MinhaContaPage() {
    const { user, getProfile } = useAuth()
    const updateUserMutation = useUpdateUser()
    const [error, setError] = useState<string | null>(null)
    const [isLoadingCep, setIsLoadingCep] = useState(false)
    const [showAddressFields, setShowAddressFields] = useState(false)

    const { handleSubmit, register, setValue, formState: { errors }, reset } = useForm<UpdateAccountFormData>({
        resolver: zodResolver(updateAccountSchema)
    })

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: {
                    zipCode: user.address?.zipCode || '',
                    street: user.address?.street || '',
                    number: user.address?.number || '',
                    district: user.address?.district || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    complement: user.address?.complement || ''
                }
            })

            if (user.address && user.address.zipCode) {
                setShowAddressFields(true)
            }
        }
    }, [user, reset])

    const handleCepSearch = useCallback(async (cep: string) => {
        setIsLoadingCep(true)

        const result = await searchCep(cep)

        if (result.success && result.data) {
            setValue('address.street', result.data.street)
            setValue('address.city', result.data.city)
            setValue('address.state', result.data.state)
            setValue('address.district', result.data.district!)
            if (result.data.complement) {
                setValue('address.complement', result.data.complement)
            }
            setShowAddressFields(true)
        } else {
            toast.error(result.error || 'Erro ao buscar CEP')
            setShowAddressFields(false)
        }

        setIsLoadingCep(false)
    }, [setValue, setShowAddressFields])

    const handleZipCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const cleanValue = value.replace(/\D/g, '')

        const formattedValue = formatCep(value)
        setValue('address.zipCode', formattedValue)

        if (cleanValue.length < 8) {
            setShowAddressFields(false)
            setValue('address.street', '')
            setValue('address.number', '')
            setValue('address.city', '')
            setValue('address.state', '')
            setValue('address.complement', '')
        }

        if (cleanValue.length === 8) {
            handleCepSearch(cleanValue)
        }
    }, [setValue, handleCepSearch, setShowAddressFields])

    const handleUpdateAccount = useCallback(async (data: UpdateAccountFormData) => {
        if (!user) return

        try {
            setError(null)

            await updateUserMutation.mutateAsync({
                id: user.id,
                ...data
            })

            await getProfile()

            toast.success('Conta atualizada com sucesso!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conta'
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }, [user, updateUserMutation, getProfile])

    if (!user) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className='flex min-h-screen'>
                <Sidebar />
                <div className='flex flex-col min-h-screen w-full ml-64'>
                    <Header title="Minha Conta" description="Ajuste informações da sua conta de forma simples" />
                    <div className='flex flex-col mt-8 mx-9'>
                        <div className="max-w-xl mx-auto w-full">
                            <div className="bg-white border rounded-lg p-8">
                                <form onSubmit={handleSubmit(handleUpdateAccount)} className="flex flex-col gap-4">
                                    {error && (
                                        <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-1 w-full">
                                            <label>Nome (Obrigatório)</label>
                                            <Input
                                                {...register('firstName')}
                                                placeholder="Insira seu nome"
                                                disabled={updateUserMutation.isPending}
                                            />
                                            {errors.firstName && (
                                                <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <label>Sobrenome (Obrigatório)</label>
                                            <Input
                                                {...register('lastName')}
                                                placeholder="Insira seu sobrenome"
                                                disabled={updateUserMutation.isPending}
                                            />
                                            {errors.lastName && (
                                                <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label>E-mail (Obrigatório)</label>
                                        <Input
                                            {...register('email')}
                                            placeholder="Insira seu e-mail"
                                            disabled={updateUserMutation.isPending}
                                        />
                                        {errors.email && (
                                            <span className="text-red-500 text-sm">{errors.email.message}</span>
                                        )}
                                    </div>

                                    <hr className="w-full bg-zinc-200" />

                                    <div className="flex flex-col gap-1">
                                        <label>CEP (Obrigatório)</label>
                                        <Input
                                            {...register('address.zipCode')}
                                            onChange={handleZipCodeChange}
                                            type="text"
                                            placeholder="00000-000"
                                            maxLength={9}
                                            disabled={updateUserMutation.isPending}
                                        />
                                        {isLoadingCep && (
                                            <span className="text-blue-500 text-sm">Buscando endereço...</span>
                                        )}
                                        {errors.address?.zipCode && (
                                            <span className="text-red-500 text-sm">{errors.address.zipCode.message}</span>
                                        )}
                                    </div>

                                    {showAddressFields && (
                                        <>
                                            <div className="flex flex-col gap-1 w-full">
                                                <label>Endereço</label>
                                                <Input
                                                    {...register('address.street')}
                                                    type="text"
                                                    placeholder="Nome da rua"
                                                    disabled={isLoadingCep || updateUserMutation.isPending}
                                                />
                                                {errors.address?.street && (
                                                    <span className="text-red-500 text-sm">{errors.address.street.message}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1" style={{ minWidth: '120px' }}>
                                                <label>Número</label>
                                                <Input
                                                    {...register('address.number')}
                                                    type="text"
                                                    placeholder="123"
                                                    disabled={updateUserMutation.isPending}
                                                />
                                                {errors.address?.number && (
                                                    <span className="text-red-500 text-sm">{errors.address.number.message}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label>Complemento</label>
                                                <Input
                                                    {...register('address.complement')}
                                                    type="text"
                                                    placeholder="Apartamento, bloco, etc."
                                                    disabled={updateUserMutation.isPending}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1 w-full">
                                                <label>Bairro</label>
                                                <Input
                                                    {...register('address.district')}
                                                    type="text"
                                                    placeholder="Nome do bairro"
                                                    disabled
                                                />
                                                {errors.address?.district && (
                                                    <span className="text-red-500 text-sm">{errors.address.district.message}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 w-full">
                                                <label>Cidade</label>
                                                <Input
                                                    {...register('address.city')}
                                                    type="text"
                                                    placeholder="Nome da cidade"
                                                    disabled
                                                />
                                                {errors.address?.city && (
                                                    <span className="text-red-500 text-sm">{errors.address.city.message}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 w-full">
                                                <label>Estado</label>
                                                <Input
                                                    {...register('address.state')}
                                                    type="text"
                                                    placeholder="UF"
                                                    disabled
                                                    maxLength={2}
                                                />
                                                {errors.address?.state && (
                                                    <span className="text-red-500 text-sm">{errors.address.state.message}</span>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full mt-4"
                                        disabled={updateUserMutation.isPending}
                                    >
                                        {updateUserMutation.isPending ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}