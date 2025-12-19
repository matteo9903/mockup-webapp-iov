import { useState } from 'react';
import { Bell } from 'lucide-react';
import { mockNotifications } from '../../data/mockData.ts';

interface NotificationsListProps {
    patientId?: string;
    showAll?: boolean;
}

function NotificationsList({ patientId, showAll = false }: NotificationsListProps) {
    const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

    let notifications = showAll
        ? mockNotifications
        : mockNotifications.filter((n) => n.patientId === patientId);

    // Sort notifications by date
    notifications = [...notifications].sort((a, b) => b.date.getTime() - a.date.getTime());

    const handleNotificationClick = (notificationId: string) => {
        const newRead = new Set(readNotifications);
        newRead.add(notificationId);
        setReadNotifications(newRead);
    };

    return (
        <div>
            {!showAll && (
                <h2 className="text-2xl font-bold text-iov-dark-blue mb-6">Notifiche Paziente</h2>
            )}

            {notifications.length === 0 && (
                <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-iov-gray-text">Nessuna notifica disponibile</p>
                </div>
            )}

            <div className="space-y-3">
                {notifications.map((notification) => {
                    const isRead = readNotifications.has(notification.id);

                    return (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-opacity duration-300 ${
                                isRead
                                ? 'bg-gray-50 border-gray-200 opacity-50'
                                : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <Bell className={`w-6 h-6 flex-shrink-0 mt-1 ${
                                    isRead ? 'text-gray-400' : 'text-blue-600'
                                    }`} />
                                <div className="flex-1">
                                    <p className={`font-medium mb-2 ${
                                        isRead ? 'text-gray-600' : 'text-iov-dark-blue'
                                        }`}>
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-iov-gray-text">
                                        <span>{notification.date.toLocaleDateString('it-IT')}</span>
                                        <span>{notification.date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
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
