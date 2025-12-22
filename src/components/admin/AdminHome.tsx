import { useNavigate } from 'react-router-dom';
import { Users, Key, Download, AlertCircle, Bell } from 'lucide-react';
import { mockPendingRegistrations } from '../../data/mockData.ts';

function AdminHome() {
    const navigate = useNavigate();
    const pendingRegistrations = mockPendingRegistrations;

    const quickActions = [
        {
            title: 'Area Gestione Associazioni Clinico-Paziente',
            description: 'Visualizza e gestisci le associazioni tra clinici e pazienti',
            icon: Users,
            color: 'bg-iov-light-blue',
            textColor: 'text-iov-dark-blue-text',
            borderColor: 'border-iov-light-blue-dark',
            onClick: () => navigate('/admin/associations'),
        },
        {
            title: 'Area Gestione Utenze Clinico',
            description: 'Crea, modifica o disabilita utenze clinico',
            icon: Key,
            color: 'bg-iov-pink',
            textColor: 'text-iov-pink-text',
            borderColor: 'border-iov-pink-border',
            onClick: () => navigate('/admin/users'),
        },
        {
            title: 'Area Export Dati',
            description: 'Esporta dati aggregati e report in formato CSV/JSON/PDF',
            icon: Download,
            color: 'bg-iov-yellow',
            textColor: 'text-iov-yellow-text',
            borderColor: 'border-iov-yellow-dark',
            onClick: () => navigate('/admin/export'),
        },
        {
            title: 'Nuove Registrazioni',
            description: 'Utenti in attesa di approvazione',
            icon: Bell,
            color: 'bg-iov-yellow',
            textColor: 'text-iov-yellow-text',
            borderColor: 'border-iov-yellow-dark',
            onClick: () => navigate('/admin/registrazioni'),
            badgeCount: pendingRegistrations,
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Pannello Admin</h1>
                <p className="text-iov-gray-text">Strumenti amministrativi per gestione utenti e dati</p>
            </div>

            {pendingRegistrations > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-yellow-900 mb-1">
                                Attenzione: Richieste di Registrazione in Attesa
                            </h3>
                            <p className="text-yellow-800">
                                Ci sono <strong>{pendingRegistrations}</strong> richieste di registrazione in attesa. Rivedi e approva le
                                richieste per permettere l'accesso ai nuovi utenti.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/registrazioni')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors whitespace-nowrap"
                        >
                            Vai alle Richieste
                        </button>
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
                            {action.badgeCount && action.badgeCount > 0 && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-20">
                                    {action.badgeCount}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md relative z-10">
                                <Icon className={`w-8 h-8 ${action.textColor}`} />
                            </div>

                            <h3 className={`text-xl font-bold ${action.textColor} mb-2 relative z-10`}>{action.title}</h3>
                            <p className={`${action.textColor} opacity-90 relative z-10`}>{action.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default AdminHome;
