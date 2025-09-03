'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthLayout from '@/layouts/AuthLayout'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { searchCep, formatCep } from '@/utils/functions/search-cep'

const signInSchema = z.object({
    firstName: z.string().min(2, 'Você precisa informar seu nome.'),
    lastName: z.string().min(2, 'Você precisa informar seu sobrenome.'),
    email: z.email('Você precisa inserir um e-mail válido.'),
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

type signIn = z.infer<typeof signInSchema>

export default function SignUp() {

    const { handleSubmit, register, setValue, formState: { errors } } = useForm<signIn>({
        resolver: zodResolver(signInSchema)
    })

    const [isLoadingCep, setIsLoadingCep] = useState(false)
    const [showAddressFields, setShowAddressFields] = useState(false)

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

    const handleSignIn = useCallback(async (data: signIn) => {
        alert(JSON.stringify(data))
    }, [])

    return (
        <AuthLayout>
            <div className='flex flex-col items-center gap-6'>
                <p className='text-2xl font-bold'>Cadastre-se</p>

                <div className='w-[490px] p-8 border rounded'>
                    <div className='flex flex-col gap-4'>

                        <div className="flex items-center gap-4">
                            <div className='flex flex-col gap-1 w-full'>
                                <label>Nome (Obrigatório)</label>
                                <Input {...register('firstName')} placeholder='Insira seu nome' />
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label>Sobrenome (Obrigatório)</label>
                                <Input {...register('lastName')} placeholder='Insira seu sobrenome' />
                            </div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label>E-mail (Obrigatório)</label>
                            <Input {...register('email')} placeholder='Insira seu e-mail' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label>Senha de acesso (Obrigatório)</label>
                            <Input {...register('password')} type='password' placeholder='Insira sua senha' />
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
                                        disabled={isLoadingCep}
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
                            onClick={handleSubmit(handleSignIn)}
                            size={"lg"}
                            className='w-full'
                        >
                            Cadastrar-se
                        </Button>
                    </div>
                </div>

            </div>
        </AuthLayout>
    )
}
