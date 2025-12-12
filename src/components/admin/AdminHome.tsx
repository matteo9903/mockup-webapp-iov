import { useNavigate } from 'react-router-dom';
import { Users, Key, Download } from 'lucide-react';

function AdminHome() {
    const navigate = useNavigate();

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
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Pannello Admin</h1>
                <p className="text-iov-gray-text">Strumenti amministrativi per gestione utenti e dati</p>
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
