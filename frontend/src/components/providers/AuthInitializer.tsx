'use client';

import { useAuthStore } from '@/store';
import { useEffect } from 'react';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <>{children}</>;
}
