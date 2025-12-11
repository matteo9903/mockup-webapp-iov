import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Home from './Home';
import PDTASelection from './PDTASelection';
import ChatbotPDTA from './ChatbotPDTA';
import Documents from './Documents';
import UsefulLinks from './UsefulLinks';
import AccessInfo from './AccessInfo';
import { Page } from '../../types';

function MMGPlatform() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'pdta-selection':
        return <PDTASelection onBack={() => setCurrentPage('home')} />;
      case 'chatbot':
        return <ChatbotPDTA onBack={() => setCurrentPage('home')} />;
      case 'documents':
        return <Documents onBack={() => setCurrentPage('home')} />;
      case 'links':
        return <UsefulLinks onBack={() => setCurrentPage('home')} />;
      case 'access-info':
        return <AccessInfo onBack={() => setCurrentPage('home')} />;
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

export default MMGPlatform;

