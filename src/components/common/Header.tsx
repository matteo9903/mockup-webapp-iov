import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title?: string;
}

function Header({ title }: HeaderProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleDisplay = () => {
        switch (user?.role) {
            case 'farmacista':
                return 'Farmacista';
            case 'clinico':
                return 'Clinico';
            case 'admin':
                return 'Admin';
            default:
                return 'Utente';
        }
    };

    return (
        <header className="bg-iov-dark-blue text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and title */}
                    <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">
                            IOV
                        </div>
                        {title && (
                            <>
                                <div className="h-8 w-px bg-white/30"></div>
                                <h1 className="text-xl font-semibold">{title}</h1>
                            </>
                        )}
                    </div>

                    {/* User info and logout */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm font-medium">{user.name} {user.surname}</div>
                                <div className="text-xs opacity-75">{getRoleDisplay()}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Esci</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
