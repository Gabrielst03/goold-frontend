import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { ReactNode } from 'react'


interface AuthLayout {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayout) {
    return (
        <>
            <header className='flex items-center justify-between w-full px-25 py-5 border-b'>
                <Image src={'/logo.png'} alt='Logo' width={43} height={43} />
                <Button size={'lg'}>Cadastre-se</Button>
            </header>

            <div className='flex flex-col items-center justify-center mt-36'>
                {children}
            </div>

        </>
    )
}
