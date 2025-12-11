import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Home from './Home';
import Triage from './Triage';
import ElencoRichiesteAmbulatori from './ElencoRichiesteAmbulatori';
import VisiteAmbulatori from './VisiteAmbulatori';
import VisualizzaPaziente from './VisualizzaPaziente';
import { CaseManagerPage } from './types';

function CaseManagerVirginiaEvelina() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<CaseManagerPage>('home');
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
      case 'elenco-richieste-ambulatori':
        return <ElencoRichiesteAmbulatori onBack={() => setCurrentPage('home')} />;
      case 'visite-ambulatori':
        return <VisiteAmbulatori onBack={() => setCurrentPage('home')} />;
      case 'visualizza-paziente':
        return <VisualizzaPaziente onBack={() => setCurrentPage('home')} />;
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

export default CaseManagerVirginiaEvelina;
