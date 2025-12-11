import { ArrowLeft, ExternalLink, Calendar, FileText, Pill, Phone, AlertCircle, GraduationCap } from 'lucide-react';

interface UsefulLinksProps {
  onBack: () => void;
}

interface Link {
  title: string;
  category: string;
  description: string;
  url: string;
  icon: typeof Calendar;
  isExternal: boolean;
}

const links: Link[] = [
  {
    title: 'CUP - Centro Unico di Prenotazione',
    category: 'Prenotazioni',
    description: 'Prenotazioni, referti e disdette del Servizio Sanitario Nazionale',
    url: 'https://www.ioveneto.it/prenotazioni-referti-e-disdette/servizio-sanitario-nazionale/',
    icon: Calendar,
    isExternal: true,
  },
  {
    title: 'Linee Guida Regionali',
    category: 'Documentazione',
    description: 'Linee guida regionali per i percorsi diagnostico-terapeutici',
    url: '#',
    icon: FileText,
    isExternal: false,
  },
  {
    title: 'Registro Farmaci',
    category: 'Risorse Cliniche',
    description: 'Accesso al registro dei farmaci e terapie disponibili',
    url: '#',
    icon: Pill,
    isExternal: false,
  },
  {
    title: 'Contatti Specialistici',
    category: 'Contatti',
    description: 'Elenco dei contatti utili dei reparti specialistici',
    url: '#',
    icon: Phone,
    isExternal: false,
  },
  {
    title: 'Gestione Emergenze',
    category: 'Urgenze',
    description: 'Procedure e contatti per la gestione delle emergenze sanitarie',
    url: '#',
    icon: AlertCircle,
    isExternal: false,
  },
  {
    title: 'Area Formazione',
    category: 'Formazione',
    description: 'Corsi e aggiornamenti professionali per medici di medicina generale',
    url: '#',
    icon: GraduationCap,
    isExternal: false,
  },
];

function UsefulLinks({ onBack }: UsefulLinksProps) {
  const handleLinkClick = (link: Link) => {
    if (link.isExternal && link.url !== '#') {
      window.open(link.url, '_blank');
    } else {
      alert('Demo: Link non disponibile nella versione demo');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Link Utili</h2>
        <p className="text-iov-gray-text mb-8 opacity-80">
          Accesso rapido a servizi e risorse per la pratica medica
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(link)}
                className="bg-white border-2 border-gray-200 hover:border-iov-light-blue rounded-lg p-6 text-left transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-iov-light-blue-light p-3 rounded-lg group-hover:bg-iov-dark-blue transition-colors">
                    <Icon className="w-6 h-6 text-iov-dark-blue group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-iov-gray-text group-hover:text-iov-dark-blue transition-colors">
                        {link.title}
                      </h3>
                      {link.isExternal && (
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <span className="inline-block bg-iov-light-blue-light text-iov-dark-blue text-xs font-medium px-2 py-1 rounded mb-2">
                      {link.category}
                    </span>
                    <p className="text-sm text-iov-gray-text opacity-80">{link.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-iov-gray-light rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-iov-gray-text italic opacity-80">
            Nota: contenuti mock a solo scopo dimostrativo. I link reali saranno configurati nell'ambiente di produzione.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UsefulLinks;

