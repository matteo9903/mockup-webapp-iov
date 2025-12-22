import { useNavigate } from 'react-router-dom';
import { Users, FileText, Bell, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { mockPatients, mockNotifications } from '../../data/mockData.ts';

function ClinicoHome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const doctorName = user?.name || user?.username || 'Utente';

    const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;
    const totalPatients = mockPatients.length;

    const quickActions = [
        {
            title: 'Lista Pazienti',
            description: `${totalPatients} pazienti totali`,
            icon: Users,
            color: 'bg-iov-light-blue',
            textColor: 'text-iov-dark-blue-text',
            borderColor: 'border-iov-light-blue-dark',
            onClick: () => navigate('/clinico/patients'),
        },
        {
            title: 'Questionari',
            description: 'Gestisci questionari',
            icon: FileText,
            color: 'bg-iov-pink',
            textColor: 'text-iov-pink-text',
            borderColor: 'border-iov-pink-border',
            onClick: () => navigate('/clinico/questionnaires'),
        },
        {
            title: 'Notifiche',
            description: `${unreadNotifications} non lette`,
            icon: Bell,
            color: 'bg-iov-yellow',
            textColor: 'text-iov-yellow-text',
            borderColor: 'border-iov-yellow-dark',
            onClick: () => navigate('/clinico/notifications'),
            badge: unreadNotifications > 0 ? unreadNotifications : undefined,
        },
        {
            title: 'Database Farmacologico',
            description: 'Accedi a Farmadati',
            icon: Database,
            color: 'bg-iov-light-blue',
            textColor: 'text-iov-dark-blue-text',
            borderColor: 'border-iov-light-blue-dark',
            onClick: () => navigate('/clinico/database'),
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">
                    Benvenuto, Dr. {doctorName}
                </h1>
                <p className="text-iov-gray-text">
                    Gestisci le approvazioni e supervisiona le terapie oncologiche
                </p>
            </div>

            {/* Notifications alert */}
            {unreadNotifications > 0 && (
                <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-blue-100 transition-colors duration-300" onClick={() => navigate('/clinico/notifications')}>
                    <div className="relative">
                        <Bell className="w-8 h-8 text-blue-600" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {unreadNotifications}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-iov-dark-blue">{unreadNotifications} {unreadNotifications > 1 ? 'notifiche' : 'notifica'} non lett{unreadNotifications > 1 ? 'e' : 'a'}</p>
                        <p className="text-sm text-iov-gray-text">Clicca per visualizzare</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.title}
                            onClick={action.onClick}
                            className={`${action.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-left group hover:-translate-y-1 border-2 ${action.borderColor} hover:border-opacity-100 border-opacity-50 relative overflow-hidden`}
                        >
                            {/* Badge */}
                            {action.badge && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {action.badge}
                                </div>
                            )}

                            {/* Decorative gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Icon */}
                            <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md relative z-10">
                                <Icon className={`w-8 h-8 ${action.textColor}`} />
                            </div>

                            {/* Content */}
                            <h3 className={`text-xl font-bold ${action.textColor} mb-2 relative z-10`}>
                                {action.title}
                            </h3>
                            <p className={`${action.textColor} opacity-90 relative z-10`}>
                                {action.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ClinicoHome;
