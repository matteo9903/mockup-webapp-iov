import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Home from './Home';
import Triage from './Triage';
import ElencoPazienti from './ElencoPazienti';
import { CaseManagerSoniaSabrinaPage } from './types';

function CaseManagerSoniaSabrina() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<CaseManagerSoniaSabrinaPage>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/clinici-iov');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'triage':
        return <Triage onBack={() => setCurrentPage('home')} />;
      case 'elenco-pazienti':
        return <ElencoPazienti onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-iov-gradient">
      <Header />
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default CaseManagerSoniaSabrina;

