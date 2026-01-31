"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, User } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    syncUserWithBackend: (user: User) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    syncUserWithBackend: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();

    // Sync user with backend when auth state changes to logged in
    useEffect(() => {
        if (user && !isSyncing) {
            // We can trigger background sync here if needed, 
            // but usually we do it explicitly after login for better error handling
        }
    }, [user]);

    const syncUserWithBackend = async (currentUser: User) => {
        if (!currentUser) return null;

        setIsSyncing(true);
        try {
            const token = await currentUser.getIdToken();

            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiBase}/auth/sync-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firebase_uid: currentUser.uid,
                    email: currentUser.email,
                    display_name: currentUser.displayName,
                    avatar_url: currentUser.photoURL,
                    email_verified: currentUser.emailVerified,
                    provider: currentUser.providerData[0]?.providerId || 'firebase'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sync user with backend');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error syncing user:', error);
            throw error;
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, syncUserWithBackend }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
