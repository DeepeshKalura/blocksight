'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password');
    const envPassword = process.env.DAPP_PASSWORD;

    if (password === envPassword) {
        // Set cookie for 7 days
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const cookieStore = await cookies();

        cookieStore.set('dapp_session', 'true', {
            expires,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        redirect('/dapp');
    } else {
        return { error: 'Invalid password' };
    }
}
