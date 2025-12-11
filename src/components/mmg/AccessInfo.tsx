import { ArrowLeft, Download, Mail, Phone, Clock, FileText } from 'lucide-react';

interface AccessInfoProps {
  onBack: () => void;
}

const accessSteps = [
  {
    number: 1,
    title: 'Invio richiesta',
    description: 'Impegnativa MMG o segnalazione con referti disponibili (imaging, istologia, laboratorio)',
  },
  {
    number: 2,
    title: 'Accoglienza e triage',
    description: 'Verifica requisiti minimi e indirizzamento al PDTA più appropriato',
  },
  {
    number: 3,
    title: 'Prima valutazione',
    description: 'Visita con referente di percorso ed eventuali approfondimenti preliminari',
  },
  {
    number: 4,
    title: 'Presa in carico',
    description: 'Definizione del PDTA e comunicazione strutturata al MMG',
  },
];

function AccessInfo({ onBack }: AccessInfoProps) {
  const handleDownloadGuide = () => {
    alert('Demo: Download guida PDF');
  };

  const handleContact = () => {
    alert('Demo: Apertura form contatto Accoglienza');
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
        <h2 className="text-3xl font-bold text-iov-gray-text mb-2">
          Informazioni su Accesso allo IOV
        </h2>
        <p className="text-iov-gray-text mb-8 opacity-80">
          Processo di accesso e contatti per l'invio dei pazienti
        </p>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-iov-gray-text mb-4">
            Processo di Accesso (4 fasi)
          </h3>
          <div className="space-y-4">
            {accessSteps.map((step) => (
              <div
                key={step.number}
                className="flex gap-4 p-4 bg-iov-light-blue-light rounded-lg border-l-4 border-iov-dark-blue"
              >
                <div className="bg-iov-dark-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h4 className="font-semibold text-iov-gray-text mb-1">
                    {step.title}
                  </h4>
                  <p className="text-iov-gray-text text-sm opacity-80">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-iov-light-blue-light rounded-lg p-6 border-2 border-iov-light-blue">
            <h3 className="text-xl font-bold text-iov-gray-text mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-iov-dark-blue" />
              Contatti Accoglienza
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-iov-dark-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-iov-gray-text">Email</p>
                  <p className="font-medium text-iov-gray-text">accoglienza@iov.example.it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-iov-dark-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-iov-gray-text">Telefono</p>
                  <p className="font-medium text-iov-gray-text">049 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-iov-dark-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-iov-gray-text">Tempi</p>
                  <p className="font-medium text-iov-gray-text">Triage: 3-5 giorni</p>
                  <p className="font-medium text-iov-gray-text">Prima visita: 10-15 giorni</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-iov-light-blue-light rounded-lg p-6 border-2 border-iov-light-blue">
            <h3 className="text-xl font-bold text-iov-gray-text mb-4">
              Azioni Disponibili
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleDownloadGuide}
                className="w-full flex items-center justify-between gap-3 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-4 py-3 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Scarica guida PDF
                </span>
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleContact}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-iov-dark-blue text-iov-dark-blue hover:bg-iov-light-blue-light px-4 py-3 rounded-lg transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                Contatta Accoglienza
              </button>
            </div>
          </div>
        </div>

        <div className="bg-iov-gray-light rounded-lg p-4 border border-iov-gray">
          <p className="text-sm text-iov-gray-text">
            Nota: contenuti mock a solo scopo dimostrativo.
            I contatti e le procedure reali saranno disponibili nell'ambiente di produzione.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AccessInfo;

