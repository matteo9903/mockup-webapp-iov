import { FileText, List, Bell, History, ArrowUpRight } from 'lucide-react';
import { OncologoPage } from './types';

interface HomeProps {
  onNavigate: (page: OncologoPage) => void;
  notificheNonLette: number;
}

function Home({ onNavigate, notificheNonLette }: HomeProps) {
  const menuItems = [
    {
      id: 'richiesta-prenotazione' as OncologoPage,
      icon: FileText,
      title: 'Richiesta prenotazione',
      description: 'Compila il form per richiedere una prenotazione visita presso gli ambulatori multidisciplinari',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
      badge: undefined as number | undefined,
    },
    {
      id: 'elenco-richieste' as OncologoPage,
      icon: List,
      title: 'Elenco richieste',
      description: 'Visualizza tutte le richieste di prenotazione effettuate presso gli ambulatori multidisciplinari',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
      badge: undefined as number | undefined,
    },
    {
      id: 'notifiche' as OncologoPage,
      icon: Bell,
      title: 'Notifiche',
      description: 'Notifiche quando il paziente completa la visita e l\'esito è disponibile',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
      badge: notificheNonLette,
    },
    {
      id: 'storico-visite in' as OncologoPage,
      icon: History,
      title: 'Storico Visite',
      description: 'Consulta lo storico delle visite  presso gli ambulatori multidisciplinari',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
      badge: undefined as number | undefined,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-7">
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
                <div className="bg-white w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm relative">
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${item.textColor}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                      {item.badge}
                    </span>
                  )}
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

