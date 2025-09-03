import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react'


interface AuthLayout {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayout) {

    const pathname = usePathname()

    const TitleButton = pathname === '/signin' ? 'Cadastre-se' : 'Login'
    const HrefButton = pathname === '/signin' ? '/signup' : '/signin'

    return (
        <>
            <header className='flex items-center justify-between w-full px-25 py-5 border-b'>
                <Image src={'/logo.png'} alt='Logo' width={43} height={43} />
                <Link href={HrefButton}>
                    <Button size={'lg'}>{TitleButton}</Button>
                </Link>
            </header>

            <div className='flex flex-col items-center justify-center mt-16'>
                {children}
            </div>

        </>
    )
}
