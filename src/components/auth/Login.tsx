import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';

function Login() {
    const { role } = useParams<{ role: UserRole }>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getRoleDisplay = () => {
        switch (role) {
            case 'farmacista':
                return { title: 'Farmacista', color: 'bg-iov-light-blue', textColor: 'text-iov-dark-blue-text' };
            case 'clinico':
                return { title: 'Clinico', color: 'bg-iov-pink', textColor: 'text-iov-pink-text' };
            case 'admin':
                return { title: 'Admin', color: 'bg-iov-yellow', textColor: 'text-iov-yellow-text' };
            default:
                return { title: 'Utente', color: 'bg-iov-light-blue', textColor: 'text-iov-dark-blue-text' };
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!role) {
            setError('Ruolo non valido');
            setIsLoading(false);
            return;
        }

        const success = await login(role, username, password);

        if (success) {
            // Navigate based on role
            if (role === 'admin') {
                // Admin stays on login page (no additional functionality)
                setIsLoading(false);
                return;
            }
            navigate(`/${role}/home`);
        } else {
            setError('Credenziali non valide. Inserisci username e password.');
            setIsLoading(false);
        }
    };

    const roleDisplay = getRoleDisplay();

    return (
        <div className="min-h-screen bg-iov-gradient flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Torna alla selezione</span>
                </button>

                {/* Login card */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`${roleDisplay.color} w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                            <LogIn className={`w-10 h-10 ${roleDisplay.textColor}`} />
                        </div>
                        <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">
                            Accesso {roleDisplay.title}
                        </h1>
                        <p className="text-iov-gray-text">
                            Inserisci le tue credenziali
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-iov-gray-text mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition-colors"
                                placeholder="Inserisci username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-iov-gray-text mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition-colors"
                                placeholder="Inserisci password"
                                required
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${roleDisplay.color} ${roleDisplay.textColor} py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
                        >
                            {isLoading ? 'Accesso in corso...' : 'Accedi'}
                        </button>
                    </form>

                    {/* Demo note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-iov-gray-text opacity-75">
                            Demo - Inserisci qualsiasi username e password
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
