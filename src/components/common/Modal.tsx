import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-iov-light-blue">
                    <h2 className="text-2xl font-bold text-iov-dark-blue">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-iov-gray-text hover:text-iov-dark-blue transition-colors p-2 hover:bg-iov-light-blue rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
