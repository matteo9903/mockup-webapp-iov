import { ApprovalStatus } from '../../types/index.ts';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: ApprovalStatus;
    size?: 'sm' | 'md' | 'lg';
}

function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    label: 'In approvazione',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    borderColor: 'border-yellow-300',
                    icon: Clock,
                };
            case 'approved':
                return {
                    label: 'Approvato',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-300',
                    icon: CheckCircle,
                };
            case 'rejected':
                return {
                    label: 'Rifiutato',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-300',
                    icon: XCircle,
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} border-2 ${config.borderColor} rounded-full font-medium ${sizeClasses[size]}`}
        >
            <Icon className={iconSizes[size]} />
            {config.label}
        </span>
    );
}

export default StatusBadge;
