'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthLayout from '@/layouts/AuthLayout'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const signInSchema = z.object({
    email: z.email('Você precisa inserir um e-mail válido.'),
    password: z.string().min(6, 'Você precisa informar sua senha.')
})

type signIn = z.infer<typeof signInSchema>

export default function SignIn() {


    const { handleSubmit, register, watch } = useForm<signIn>({
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

    const canSubmit = isEmailValid() && isPasswordValid()


    const handleSignIn = useCallback(async (data: signIn) => {
        alert(data)
    }, [])

    return (
        <AuthLayout>
            <div className='flex flex-col items-center gap-6'>
                <p className='text-2xl font-bold'>Entre em sua conta</p>

                <div className='w-[448px] p-8 border rounded'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label>E-mail (Obrigatório)</label>
                            <Input {...register('email')} placeholder='Insira seu e-mail' />
                        </div>

                        {isEmailValid() && (
                            <div className='flex flex-col gap-1'>
                                <label>Senha de acesso (Obrigatório)</label>
                                <Input {...register('password')} type='password' placeholder='Insira sua senha' />
                            </div>
                        )}

                        <Button
                            onClick={handleSubmit(handleSignIn)}
                            size={"lg"}
                            className='w-full'
                            disabled={!canSubmit}
                        >
                            Acessar Conta
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <p>Ainda não tem um cadastro?</p>
                        <Link href={'/signup'} className='font-bold underline cursor-pointer'>Cadastre-se</Link>
                    </div>
                </div>

            </div>
        </AuthLayout>
    )
}
