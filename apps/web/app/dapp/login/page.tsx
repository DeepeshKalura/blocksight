'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const initialState = {
    error: '',
} as const;

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center text-center">
                    <Image
                        src="/project-logo-nobg.png"
                        alt="BlockSight Logo"
                        width={60}
                        height={60}
                        className="mb-4"
                    />
                    <h1 className="text-3xl font-bold tracking-tight">Access Required</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Please enter the password to access the dApp demo.
                    </p>
                </div>

                <div className="border border-gray-800 bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm">
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter password..."
                                required
                                className="bg-black/50 border-gray-700 focus:border-accent"
                            />
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm font-medium">
                                {state.error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-accent hover:opacity-90 text-accent-foreground transition-all"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Access Demo'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}