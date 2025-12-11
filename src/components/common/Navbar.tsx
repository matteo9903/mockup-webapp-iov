import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface NavItem {
    to: string;
    label: string;
    icon?: ReactNode;
}

interface NavbarProps {
    items: NavItem[];
}

function Navbar({ items }: NavbarProps) {
    return (
        <nav className="bg-white shadow-md border-b-2 border-iov-light-blue">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `px-6 py-4 font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-4 ${isActive
                                    ? 'text-iov-dark-blue border-iov-dark-blue'
                                    : 'text-iov-gray-text border-transparent hover:text-iov-dark-blue hover:border-iov-light-blue'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
