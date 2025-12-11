import { LogOut, User } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

function Navbar({ isLoggedIn, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-iov-dark-blue border-b-2 border-iov-dark-blue py-2 px-1 sm:px-2">
              Visite Giornaliere
            </span>
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
              <div className="hidden sm:flex items-center gap-2 bg-iov-light-blue-light px-3 sm:px-4 py-2 rounded-lg">
                <User className="w-4 h-4 text-iov-dark-blue" />
                <span className="text-xs sm:text-sm font-medium text-iov-gray-text hidden md:inline">
                  Medico
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


