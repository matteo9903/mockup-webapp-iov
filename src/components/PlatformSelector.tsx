import { useNavigate } from 'react-router-dom';
import { Pill, Stethoscope, UserCog, UserPlus } from 'lucide-react';

export type Platform = 'farmacista' | 'clinico' | 'admin';

function PlatformSelector() {
  const navigate = useNavigate();
  const platforms = [
    {
      id: 'farmacista' as Platform,
      icon: Pill,
      title: 'Farmacista',
      description: 'Onboarding pazienti e gestione terapie',
      color: 'bg-iov-light-blue',
      textColor: 'text-iov-dark-blue-text',
      iconColor: 'text-iov-dark-blue-text',
      borderColor: 'border-iov-light-blue-dark',
    },
    {
      id: 'clinico' as Platform,
      icon: Stethoscope,
      title: 'Clinico',
      description: 'Approvazione richieste e gestione pazienti',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
    {
      id: 'admin' as Platform,
      icon: UserCog,
      title: 'Admin',
      description: 'Gestione utenti e sistema',
      color: 'bg-iov-yellow',
      textColor: 'text-iov-yellow-text',
      iconColor: 'text-iov-yellow-text',
      borderColor: 'border-iov-yellow-dark',
    },
  ];

  return (
    <div className="min-h-screen bg-iov-gradient flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-iov-dark-blue mb-4">
            Gestione Terapia Oncologica IOV
          </h1>
          <p className="text-lg sm:text-xl text-iov-gray-text">
            Seleziona il tipo di accesso
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => {
                  navigate(`/login/${platform.id}`);
                }}
                className={`${platform.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left group hover:-translate-y-2 border-2 ${platform.borderColor} hover:border-opacity-100 border-opacity-50 relative overflow-hidden flex flex-col h-full`}
              >
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon container */}
                <div className="bg-white w-20 h-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md relative z-10 flex-shrink-0">
                  <Icon className={`w-10 h-10 ${platform.iconColor}`} />
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold ${platform.textColor} mb-3 relative z-10 flex-shrink-0`}>
                  {platform.title}
                </h2>

                {/* Description */}
                <p className={`${platform.textColor} text-base leading-relaxed opacity-90 relative z-10 flex-grow`}>
                  {platform.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Registration Section */}
        <div className="mt-12 text-center">
          <p className="text-iov-gray-text mb-4">
            Non hai un account?
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-white text-iov-dark-blue px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow border-2 border-iov-dark-blue"
          >
            <UserPlus className="w-5 h-5" />
            Registrati
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-iov-gray-text opacity-75">
            Demo - Sistema di gestione terapia oncologica IOV
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlatformSelector;

