import logo from '../../../../Immagine1.svg';

function Header() {
  return (
    <header className="bg-iov-dark-blue shadow-md">
      <div className="container mx-auto px-4 py-5 sm:py-7 md:py-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img 
              src={logo} 
              alt="IOV Logo" 
              className="h-9 sm:h-11 md:h-12 w-auto"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
              Portale Case Manager
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">
              Area Case Manager Sonia-Sabrina
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

