import { useNavigate } from 'react-router-dom';
import { Stethoscope, Users, UserCheck, Heart, Building2, Activity, ArrowLeft } from 'lucide-react';

export type CliniciIOVStakeholder = 
  | 'oncologo-radioterapista'
  | 'case-manager-sonia-sabrina'
  | 'case-manager-virginia-evelina'
  | 'ambulatorio-cure-simultanee'
  | 'ambulatorio-oncogeriatria'
  | 'ambulatorio-osteoncologia';

function CliniciIOVSelector() {
  const navigate = useNavigate();
  const stakeholders = [
    {
      id: 'oncologo-radioterapista' as CliniciIOVStakeholder,
      icon: Stethoscope,
      title: 'Specialisti',
      description: 'Area dedicata agli oncologi e radioterapisti',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
    {
      id: 'case-manager-sonia-sabrina' as CliniciIOVStakeholder,
      icon: Users,
      title: 'Case Manager Sonia-Sabrina',
      description: 'Area Case Manager Sonia e Sabrina',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
    {
      id: 'case-manager-virginia-evelina' as CliniciIOVStakeholder,
      icon: UserCheck,
      title: 'Case Manager Virginia-Evelina',
      description: 'Area Case Manager Virginia e Evelina',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
    {
      id: 'ambulatorio-cure-simultanee' as CliniciIOVStakeholder,
      icon: Heart,
      title: 'Ambulatorio Cure Simultanee',
      description: 'Area ambulatorio cure simultanee',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
    {
      id: 'ambulatorio-oncogeriatria' as CliniciIOVStakeholder,
      icon: Building2,
      title: 'Ambulatorio Oncogeriatria',
      description: 'Area ambulatorio oncogeriatria',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
    {
      id: 'ambulatorio-osteoncologia' as CliniciIOVStakeholder,
      icon: Activity,
      title: 'Ambulatorio Osteoncologia',
      description: 'Area ambulatorio osteoncologia',
      color: 'bg-iov-pink',
      textColor: 'text-iov-pink-text',
      iconColor: 'text-iov-pink-text',
      borderColor: 'border-iov-pink-border',
    },
  ];

  return (
    <div className="min-h-screen bg-iov-gradient flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Torna alla selezione piattaforma</span>
        </button>
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-iov-dark-blue mb-4">
            Area Clinici IOV
          </h1>
          <p className="text-lg sm:text-xl text-iov-gray-text">
            Seleziona il tuo ruolo
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stakeholders.map((stakeholder) => {
            const Icon = stakeholder.icon;
            return (
              <button
                key={stakeholder.id}
                onClick={() => navigate(`/clinici-iov/${stakeholder.id}`)}
                className={`${stakeholder.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left group hover:-translate-y-2 border-2 ${stakeholder.borderColor} hover:border-opacity-100 border-opacity-50 relative overflow-hidden`}
              >
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon container */}
                <div className="bg-white w-20 h-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md relative z-10">
                  <Icon className={`w-10 h-10 ${stakeholder.iconColor}`} />
                </div>
                
                {/* Title */}
                <h2 className={`text-2xl font-bold ${stakeholder.textColor} mb-3 relative z-10`}>
                  {stakeholder.title}
                </h2>
                
                {/* Description */}
                <p className={`${stakeholder.textColor} text-base leading-relaxed opacity-90 relative z-10`}>
                  {stakeholder.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-iov-gray-text opacity-75">
            Demo - Ogni stakeholder può accedere solo alla propria area
          </p>
        </div>
      </div>
    </div>
  );
}

export default CliniciIOVSelector;

