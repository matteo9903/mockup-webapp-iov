import { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { pdtaData } from '../../data/pdtaData';

interface PDTASelectionProps {
  onBack: () => void;
}

function PDTASelection({ onBack }: PDTASelectionProps) {
  const [selectedPDTA, setSelectedPDTA] = useState<string | null>(null);

  const selectedData = selectedPDTA ? pdtaData.find(p => p.id === selectedPDTA) : null;

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
        <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Selezione PDTA</h2>
        <p className="text-iov-gray-text mb-8 opacity-80">
          Seleziona un PDTA per visualizzare gli esami preliminari necessari
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {pdtaData.map((pdta) => (
            <button
              key={pdta.id}
              onClick={() => setSelectedPDTA(pdta.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPDTA === pdta.id
                  ? 'border-iov-dark-blue bg-iov-light-blue-light'
                  : 'border-gray-200 hover:border-iov-light-blue bg-white'
              }`}
            >
              <h3 className="font-semibold text-iov-gray-text">{pdta.name}</h3>
            </button>
          ))}
        </div>

        {selectedData && (
          <div className="bg-iov-light-blue-light rounded-lg p-8 border-2 border-iov-light-blue">
            <h3 className="text-xl font-bold text-iov-gray-text mb-8">
              Esami preliminari per PDTA {selectedData.name}
            </h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {selectedData.exams.map((exam, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold mb-3">
                      {index + 1}
                    </div>
                    <div className="bg-white rounded-lg border-2 border-iov-light-blue px-4 py-3 text-center min-w-[140px]">
                      <p className="text-iov-gray-text font-medium text-sm">{exam}</p>
                    </div>
                  </div>
                  {index < selectedData.exams.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-iov-dark-blue flex-shrink-0 mb-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedData && (
          <div className="text-center py-12 text-gray-500">
            Seleziona un PDTA per visualizzare gli esami richiesti
          </div>
        )}
      </div>
    </div>
  );
}

export default PDTASelection;

