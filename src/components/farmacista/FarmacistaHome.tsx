import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, FileText, Bell, Database, Activity } from 'lucide-react';
import { mockPatients, mockNotifications, mockPendingApprovals } from '../../data/mockData.ts';

function FarmacistaHome() {
    const navigate = useNavigate();

    const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;
    const totalPatients = mockPatients.length;
    const pendingApprovals = mockPendingApprovals.length;

    const quickActions = [
        {
            title: 'Nuovo Paziente',
            description: 'Avvia onboarding paziente',
            icon: UserPlus,
            color: 'bg-iov-yellow',
            textColor: 'text-iov-yellow-text',
            borderColor: 'border-iov-yellow-dark',
            onClick: () => navigate('/farmacista/onboarding'),
        },
        {
            title: 'Lista Pazienti',
            description: `${totalPatients} pazienti totali`,
            icon: Users,
            color: 'bg-iov-light-blue',
            textColor: 'text-iov-dark-blue-text',
            borderColor: 'border-iov-light-blue-dark',
            onClick: () => navigate('/farmacista/patients'),
        },
        {
            title: 'Questionari',
            description: 'Gestisci questionari',
            icon: FileText,
            color: 'bg-iov-pink',
            textColor: 'text-iov-pink-text',
            borderColor: 'border-iov-pink-border',
            onClick: () => navigate('/farmacista/questionnaires'),
        },
        {
            title: 'Notifiche',
            description: `${unreadNotifications} non lette`,
            icon: Bell,
            color: 'bg-iov-yellow',
            textColor: 'text-iov-yellow-text',
            borderColor: 'border-iov-yellow-dark',
            onClick: () => navigate('/farmacista/notifications'),
            badge: unreadNotifications > 0 ? unreadNotifications : undefined,
        },
        {
            title: 'Database Farmacologico',
            description: 'Accedi a Farmadati',
            icon: Database,
            color: 'bg-iov-light-blue',
            textColor: 'text-iov-dark-blue-text',
            borderColor: 'border-iov-light-blue-dark',
            onClick: () => navigate('/farmacista/database'),
        },
        {
            title: 'Richieste in Approvazione',
            description: `${pendingApprovals} in attesa`,
            icon: Activity,
            color: 'bg-iov-pink',
            textColor: 'text-iov-pink-text',
            borderColor: 'border-iov-pink-border',
            onClick: () => navigate('/farmacista/approvals'),
            badge: pendingApprovals > 0 ? pendingApprovals : undefined,
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">
                    Benvenuto, Farmacista
                </h1>
                <p className="text-iov-gray-text">
                    Gestisci i pazienti e le terapie oncologiche
                </p>
            </div>

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

export default FarmacistaHome;
