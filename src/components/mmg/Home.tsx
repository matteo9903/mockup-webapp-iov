import { FileText, MessageSquare, FolderOpen, ExternalLink, Info, ArrowUpRight } from 'lucide-react';
import { Page } from '../../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

function Home({ onNavigate }: HomeProps) {
  const menuItems = [
    {
      id: 'pdta-selection' as Page,
      icon: FileText,
      title: 'Selezione PDTA',
      description: 'Verifica dei requisiti ed esami preliminari per i PDTA',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
    },
    {
      id: 'chatbot' as Page,
      icon: MessageSquare,
      title: 'Chatbot PDTA',
      description: 'Assistente AI per valutazione casi clinici e interpretazione PDTA',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
    },
    {
      id: 'documents' as Page,
      icon: FolderOpen,
      title: 'Documenti PDTA',
      description: 'Visualizzazione e download documenti per ciascun PDTA',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
    },
    {
      id: 'links' as Page,
      icon: ExternalLink,
      title: 'Link Utili',
      description: 'Accesso rapido a servizi e risorse per la pratica medica',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
    },
    {
      id: 'access-info' as Page,
      icon: Info,
      title: 'Informazioni Accesso IOV',
      description: 'Processo di accesso e contatti per l\'invio pazienti',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`${item.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 sm:p-7 md:p-8 text-left group hover:-translate-y-2 border border-iov-light-blue-dark/30 hover:border-iov-light-blue-dark/50 relative overflow-hidden`}
            >
              {/* Decorative gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Header with icon and title */}
              <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-5 relative z-10">
                {/* Icon container */}
                <div className="bg-white w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${item.textColor}`} />
                </div>
                
                {/* Title with arrow */}
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <h3 className={`text-lg sm:text-xl font-bold ${item.textColor} leading-tight`}>
                    {item.title}
                  </h3>
                  <ArrowUpRight className={`w-5 h-5 sm:w-6 sm:h-6 ${item.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-2`} />
                </div>
              </div>
              
              {/* Description */}
              <div className="relative z-10">
                <p className={`${item.textColor} text-sm sm:text-base leading-relaxed opacity-90`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Home;

