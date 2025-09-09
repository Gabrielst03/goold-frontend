'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthLayout from '@/layouts/AuthLayout'
import { useAuth } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { searchCep, formatCep } from '@/utils/functions/search-cep'

const signUpSchema = z.object({
    firstName: z.string().min(2, 'Você precisa informar seu nome.'),
    lastName: z.string().min(2, 'Você precisa informar seu sobrenome.'),
    email: z.string().email('Você precisa inserir um e-mail válido.'),
    password: z.string().min(6, 'Você precisa informar sua senha.'),
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

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUp() {
    const { signup, isLoading } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [isLoadingCep, setIsLoadingCep] = useState(false)
    const [showAddressFields, setShowAddressFields] = useState(false)

    const { handleSubmit, register, setValue, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema)
    })

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
            alert(result.error || 'Erro ao buscar CEP')
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

    const handleSignUp = useCallback(async (data: SignUpFormData) => {
        try {
            setError(null)

            const signupData = {
                ...data,
                accountType: 'customer' as const
            }

            await signup(signupData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar conta')
        }
    }, [signup])

    return (
        <AuthLayout>
            <div className='flex flex-col items-center gap-6'>
                <p className='text-2xl font-bold'>Cadastre-se</p>

                <div className='w-[490px] p-8 border rounded'>
                    <form onSubmit={handleSubmit(handleSignUp)} className='flex flex-col gap-4'>
                        {error && (
                            <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <div className='flex flex-col gap-1 w-full'>
                                <label>Nome (Obrigatório)</label>
                                <Input
                                    {...register('firstName')}
                                    placeholder='Insira seu nome'
                                    disabled={isLoading}
                                />
                                {errors.firstName && (
                                    <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                                )}
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label>Sobrenome (Obrigatório)</label>
                                <Input
                                    {...register('lastName')}
                                    placeholder='Insira seu sobrenome'
                                    disabled={isLoading}
                                />
                                {errors.lastName && (
                                    <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label>E-mail (Obrigatório)</label>
                            <Input
                                {...register('email')}
                                placeholder='Insira seu e-mail'
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">{errors.email.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label>Senha de acesso (Obrigatório)</label>
                            <Input
                                {...register('password')}
                                type='password'
                                placeholder='Insira sua senha'
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">{errors.password.message}</span>
                            )}
                        </div>

                        <hr className='w-full bg-zinc-200' />

                        <div className='flex flex-col gap-1'>
                            <label>CEP (Obrigatório)</label>
                            <Input
                                {...register('address.zipCode')}
                                onChange={handleZipCodeChange}
                                type='text'
                                placeholder='00000-000'
                                maxLength={9}
                                disabled={isLoading}
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
                                <div className='flex flex-col gap-1 w-full'>
                                    <label>Endereço</label>
                                    <Input
                                        {...register('address.street')}
                                        type='text'
                                        placeholder='Nome da rua'
                                        disabled={isLoadingCep || isLoading}
                                    />
                                    {errors.address?.street && (
                                        <span className="text-red-500 text-sm">{errors.address.street.message}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-1' style={{ minWidth: '120px' }}>
                                    <label>Número</label>
                                    <Input
                                        {...register('address.number')}
                                        type='text'
                                        placeholder='123'
                                        disabled={isLoading}
                                    />
                                    {errors.address?.number && (
                                        <span className="text-red-500 text-sm">{errors.address.number.message}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label>Complemento</label>
                                    <Input
                                        {...register('address.complement')}
                                        type='text'
                                        placeholder='Apartamento, bloco, etc.'
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label>Bairro</label>
                                    <Input
                                        {...register('address.district')}
                                        type='text'
                                        placeholder='Nome do bairro'
                                        disabled
                                    />
                                    {errors.address?.district && (
                                        <span className="text-red-500 text-sm">{errors.address.district.message}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label>Cidade</label>
                                    <Input
                                        {...register('address.city')}
                                        type='text'
                                        placeholder='Nome da cidade'
                                        disabled
                                    />
                                    {errors.address?.city && (
                                        <span className="text-red-500 text-sm">{errors.address.city.message}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label>Estado</label>
                                    <Input
                                        {...register('address.state')}
                                        type='text'
                                        placeholder='UF'
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
                            size={"lg"}
                            className='w-full'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cadastrando...' : 'Cadastrar-se'}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between mt-6">
                        <p>Já tem uma conta?</p>
                        <Link href={'/signin'} className='font-bold underline cursor-pointer'>Fazer login</Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}
