import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthState, AuthResult, RegisterPayload } from '../types/index.ts';

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

    const parseErrorMessage = async (response: Response, fallback: string): Promise<string> => {
        try {
            const data = await response.json();
            if (typeof data?.message === 'string') {
                return data.message;
            }
            if (data && typeof data === 'object') {
                const errors = Object.values(data).filter((value) => typeof value === 'string');
                if (errors.length > 0) {
                    return errors.join(' ');
                }
            }
        } catch {
            // ignore parsing errors
        }
        return fallback;
    };

    const mapApiRole = (apiRole?: string): UserRole | null => {
        switch ((apiRole || '').toUpperCase()) {
            case 'FARMACISTA':
                return 'farmacista';
            case 'CLINICO':
                return 'clinico';
            case 'AMMINISTRATORE':
                return 'admin';
            default:
                return null;
        }
    };

    const mapUiRoleToApi = (role: UserRole): string | null => {
        switch (role) {
            case 'farmacista':
                return 'FARMACISTA';
            case 'clinico':
                return 'CLINICO';
            case 'admin':
                return 'AMMINISTRATORE';
            default:
                return null;
        }
    };

    const buildUser = (username: string, resolvedRole: UserRole): User => {
        const userName = username.includes('@') ? username.split('@')[0] : username;
        return {
            id: `user-${Date.now()}`,
            username,
            role: resolvedRole,
            name: userName,
            surname: resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1),
        };
    };

    const login = async (role: UserRole, username: string, password: string): Promise<AuthResult> => {
        if (!username.trim() || !password.trim()) {
            return { ok: false, error: 'Email e password sono obbligatorie.' };
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password,
                }),
            });

            if (!response.ok) {
                const message = await parseErrorMessage(response, 'Credenziali non valide. Inserisci email e password.');
                return { ok: false, error: message };
            }

            const data: { token?: string; role?: string } = await response.json();
            const resolvedRole = mapApiRole(data.role);
            if (!data.token) {
                return { ok: false, error: 'Risposta di autenticazione non valida.' };
            }
            if (!resolvedRole) {
                return { ok: false, error: 'Ruolo non riconosciuto per questo account.' };
            }
            if (resolvedRole !== role) {
                return { ok: false, error: 'Ruolo non autorizzato per questo accesso.' };
            }

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_role', resolvedRole);

            setUser(buildUser(username, resolvedRole));
            return { ok: true, role: resolvedRole };
        } catch {
            return { ok: false, error: 'Errore di rete. Riprova più tardi.' };
        }
    };

    const register = async (payload: RegisterPayload): Promise<AuthResult> => {
        const apiRole = mapUiRoleToApi(payload.role);
        if (!apiRole) {
            return { ok: false, error: 'Ruolo non valido.' };
        }

        try {
            const response = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: payload.email.trim(),
                    password: payload.password,
                    name: payload.name.trim(),
                    surname: payload.surname.trim(),
                    fiscalCode: payload.fiscalCode.trim().toUpperCase(),
                    telephone: payload.telephone ?? null,
                    sedeIov: payload.sedeIov ?? null,
                    unitaOperativaId: payload.unitaOperativaId ?? null,
                    role: apiRole,
                }),
            });

            if (!response.ok) {
                const message = await parseErrorMessage(response, 'Registrazione fallita.');
                return { ok: false, error: message };
            }

            const data: { token?: string; role?: string } = await response.json();
            const resolvedRole = mapApiRole(data.role) ?? payload.role;

            if (!data.token) {
                return { ok: false, error: 'Risposta di registrazione non valida.' };
            }

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_role', resolvedRole);
            setUser(buildUser(payload.email, resolvedRole));

            return { ok: true, role: resolvedRole };
        } catch {
            return { ok: false, error: 'Errore di rete. Riprova più tardi.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
        setUser(null);
    };

    const value: AuthState = {
        user,
        isAuthenticated: !!user,
        login,
        register,
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
