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

const signInSchema = z.object({
    email: z.string().email('Você precisa inserir um e-mail válido.'),
    password: z.string().min(6, 'Você precisa informar sua senha.')
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
    const { login, isLoading } = useAuth()
    const [error, setError] = useState<string | null>(null)

    const { handleSubmit, register, watch, formState: { errors } } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema)
    })

    const email = watch('email')
    const password = watch('password')

    const isEmailValid = () => {
        try {
            signInSchema.shape.email.parse(email)
            return true
        } catch {
            return false
        }
    }

    const isPasswordValid = () => {
        try {
            signInSchema.shape.password.parse(password)
            return true
        } catch {
            return false
        }
    }

    const canSubmit = isEmailValid() && isPasswordValid() && !isLoading

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {
            setError(null)
            await login(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login')
        }
    }, [login])

    return (
        <AuthLayout>
            <div className='flex flex-col items-center gap-6'>
                <p className='text-2xl font-bold'>Entre em sua conta</p>

                <div className='w-[448px] p-8 border rounded'>
                    <form onSubmit={handleSubmit(handleSignIn)} className='flex flex-col gap-4'>
                        {error && (
                            <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}

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

                        {isEmailValid() && (
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
                        )}

                        <Button
                            type="submit"
                            size={"lg"}
                            className='w-full'
                            disabled={!canSubmit}
                        >
                            {isLoading ? 'Entrando...' : 'Acessar Conta'}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between mt-6">
                        <p>Ainda não tem um cadastro?</p>
                        <Link href={'/signup'} className='font-bold underline cursor-pointer'>Cadastre-se</Link>
                    </div>
                </div>

            </div>
        </AuthLayout>
    )
}
