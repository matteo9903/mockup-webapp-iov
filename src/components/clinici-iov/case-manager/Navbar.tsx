import { LogOut, User } from 'lucide-react';
import { CaseManagerPage } from './types';

interface NavbarProps {
  currentPage: CaseManagerPage;
  onNavigate: (page: CaseManagerPage) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

function Navbar({ currentPage, onNavigate, isLoggedIn, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'home' as CaseManagerPage, label: 'Home' },
    { id: 'triage' as CaseManagerPage, label: 'Triage' },
    { id: 'elenco-richieste-ambulatori' as CaseManagerPage, label: 'Elenco Richieste Ambulatori' },
    { id: 'visite-ambulatori' as CaseManagerPage, label: 'Visite Ambulatori' },
    { id: 'visualizza-paziente' as CaseManagerPage, label: 'Visualizza Paziente' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 overflow-x-auto scrollbar-hide flex-1 min-w-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-xs sm:text-sm font-medium transition-colors py-2 px-1 sm:px-2 border-b-2 whitespace-nowrap flex-shrink-0 ${
                  currentPage === item.id
                    ? 'border-iov-dark-blue text-iov-dark-blue'
                    : 'border-transparent text-iov-gray-text hover:text-iov-dark-blue'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
              <div className="hidden sm:flex items-center gap-2 bg-iov-light-blue-light px-3 sm:px-4 py-2 rounded-lg">
                <User className="w-4 h-4 text-iov-dark-blue" />
                <span className="text-xs sm:text-sm font-medium text-iov-gray-text hidden md:inline">
                  Case Manager Virginia-Evelina
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-iov-gray-text hover:text-red-600 transition-colors p-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

