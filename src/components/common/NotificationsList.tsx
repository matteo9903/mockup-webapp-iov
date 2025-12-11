import { useState } from 'react';
import { Bell, AlertCircle, AlertTriangle, Info, SortAsc } from 'lucide-react';
import { mockNotifications } from '../../data/mockData.ts';
import { NotificationUrgency } from '../../types/index.ts';

interface NotificationsListProps {
    patientId?: string;
    showAll?: boolean;
}

type SortBy = 'date' | 'urgency';

function NotificationsList({ patientId, showAll = false }: NotificationsListProps) {
    const [sortBy, setSortBy] = useState<SortBy>('date');

    let notifications = showAll
        ? mockNotifications
        : mockNotifications.filter((n) => n.patientId === patientId);

    // Sort notifications
    notifications = [...notifications].sort((a, b) => {
        if (sortBy === 'date') {
            return b.date.getTime() - a.date.getTime();
        } else {
            const urgencyOrder: Record<NotificationUrgency, number> = { high: 3, medium: 2, low: 1 };
            return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
    });

    const getUrgencyConfig = (urgency: NotificationUrgency) => {
        switch (urgency) {
            case 'high':
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-300',
                    iconColor: 'text-red-600',
                    label: 'Alta',
                };
            case 'medium':
                return {
                    icon: AlertTriangle,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-300',
                    iconColor: 'text-yellow-600',
                    label: 'Media',
                };
            case 'low':
                return {
                    icon: Info,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-300',
                    iconColor: 'text-blue-600',
                    label: 'Bassa',
                };
        }
    };

    return (
        <div>
            {!showAll && (
                <h2 className="text-2xl font-bold text-iov-dark-blue mb-6">Notifiche Paziente</h2>
            )}

            {/* Sort controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center gap-4">
                    <SortAsc className="w-5 h-5 text-iov-dark-blue" />
                    <span className="text-sm font-medium text-iov-gray-text">Ordina per:</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('date')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${sortBy === 'date'
                                ? 'bg-iov-dark-blue text-white'
                                : 'bg-gray-200 text-iov-gray-text hover:bg-gray-300'
                                }`}
                        >
                            Data
                        </button>
                        <button
                            onClick={() => setSortBy('urgency')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${sortBy === 'urgency'
                                ? 'bg-iov-dark-blue text-white'
                                : 'bg-gray-200 text-iov-gray-text hover:bg-gray-300'
                                }`}
                        >
                            Urgenza
                        </button>
                    </div>
                </div>
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-iov-gray-text">Nessuna notifica disponibile</p>
                </div>
            )}

            <div className="space-y-3">
                {notifications.map((notification) => {
                    const config = getUrgencyConfig(notification.urgency);
                    const Icon = config.icon;

                    return (
                        <div
                            key={notification.id}
                            className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4 ${!notification.isRead ? 'border-l-4' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-1`} />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <p className="text-iov-dark-blue font-medium">{notification.message}</p>
                                        {!notification.isRead && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                Nuova
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-iov-gray-text">
                                        <span>{notification.date.toLocaleDateString('it-IT')}</span>
                                        <span>{notification.date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className={`${config.iconColor} font-medium`}>Urgenza: {config.label}</span>
                                        {notification.patientName && showAll && (
                                            <span className="font-medium">Paziente: {notification.patientName}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default NotificationsList;
