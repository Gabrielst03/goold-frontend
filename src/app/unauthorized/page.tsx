'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Unauthorized() {
    const { user } = useAuth()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Acesso Negado
                    </h1>
                    <p className="text-gray-600">
                        Você não tem permissão para acessar esta página.
                    </p>
                </div>

                {user && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Logado como: <span className="font-medium">{user.firstName} {user.lastName}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Tipo de conta: <span className="font-medium">{user.accountType}</span>
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Link href="/">
                        <Button className="w-full">
                            Voltar ao Dashboard
                        </Button>
                    </Link>

                    <Link href="/signin">
                        <Button variant="outline" className="w-full">
                            Fazer Login com Outra Conta
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
