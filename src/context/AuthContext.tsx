import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthState } from '../types/index.ts';

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const login = async (role: UserRole, username: string, password: string): Promise<boolean> => {
        // Mock authentication - accept any non-empty credentials
        if (username.trim() && password.trim()) {
            const mockUser: User = {
                id: `user-${Date.now()}`,
                username,
                role,
                name: username,
                surname: role.charAt(0).toUpperCase() + role.slice(1),
            };
            setUser(mockUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const value: AuthState = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
