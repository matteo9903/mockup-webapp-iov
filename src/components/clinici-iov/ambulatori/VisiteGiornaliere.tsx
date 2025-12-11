import { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, Eye, Download } from 'lucide-react';
import { Ambulatorio, VisitaAmbulatorio } from './types';

interface VisiteGiornaliereProps {
  ambulatorio: Ambulatorio;
  visite: VisitaAmbulatorio[];
}

function VisiteGiornaliere({ ambulatorio, visite }: VisiteGiornaliereProps) {
  const [dataSelezionata, setDataSelezionata] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedVisita, setSelectedVisita] = useState<VisitaAmbulatorio | null>(null);

  const visiteFiltrate = visite.filter(visita => {
    return visita.data === dataSelezionata;
  });

  const handleExportVisite = () => {
    if (visiteFiltrate.length === 0) {
      alert('Nessuna visita da esportare per questa data');
      return;
    }

    // Crea il contenuto CSV
    const headers = [
      'Ora',
      'Tipo',
      'Nome',
      'Cognome',
      'Codice Fiscale',
      'Medico Referente',
    ];

    // Aggiungi colonne specifiche per ambulatorio
    if (ambulatorio === 'Cure Simultanee') {
      headers.push('Problemi');
    } else if (ambulatorio === 'Oncogeriatria') {
      headers.push('Neoplasia', 'Stadio', 'Finalità Trattamento', 'ECOG PS', 'Punteggio G8', 'Esito VGM', 'Quesito per Geriatra');
    } else if (ambulatorio === 'Osteoncologia') {
      headers.push('Problemi', 'Quesito');
    }

    const rows = visiteFiltrate
      .sort((a, b) => {
        if (!a.ora && !b.ora) return 0;
        if (!a.ora) return 1;
        if (!b.ora) return -1;
        return a.ora.localeCompare(b.ora);
      })
      .map(visita => {
        const baseRow = [
          visita.ora || (visita.tipo === 'discussione' ? 'Discussione' : '-'),
          visita.tipo === 'discussione' ? 'Discussione' : 'Visita',
          visita.paziente.nome,
          visita.paziente.cognome,
          visita.paziente.codiceFiscale,
          visita.medicoReferente || '-',
        ];

        if (ambulatorio === 'Cure Simultanee') {
          baseRow.push(visita.problemi || '-');
        } else if (ambulatorio === 'Oncogeriatria') {
          baseRow.push(
            visita.neoplasia || '-',
            visita.stadio || '-',
            visita.finalitaTrattamento || '-',
            visita.ecogPS !== undefined ? visita.ecogPS.toString() : '-',
            visita.punteggioG8 !== undefined ? visita.punteggioG8.toString() : '-',
            visita.esitoVGM || '-',
            visita.quesitoGeriatra ? visita.quesitoGeriatra.join('; ') : '-'
          );
        } else if (ambulatorio === 'Osteoncologia') {
          baseRow.push(
            visita.problemi || '-',
            visita.quesito || '-'
          );
        }

        return baseRow;
      });

    // Converti in CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Crea e scarica il file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visite_${ambulatorio.replace(/\s+/g, '_')}_${dataSelezionata}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDettagliAmbulatorio = (visita: VisitaAmbulatorio) => {
    switch (visita.ambulatorio) {
      case 'Cure Simultanee':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Problemi</label>
              <p className="text-sm text-iov-gray-text">{visita.problemi || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medico Referente</label>
              <p className="text-sm text-iov-gray-text font-medium">{visita.medicoReferente || '-'}</p>
            </div>
          </div>
        );
      case 'Oncogeriatria':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Neoplasia</label>
              <p className="text-sm text-iov-gray-text">{visita.neoplasia || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Stadio</label>
              <p className="text-sm text-iov-gray-text">{visita.stadio || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Finalità Trattamento</label>
              <p className="text-sm text-iov-gray-text">{visita.finalitaTrattamento || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ECOG PS</label>
              <p className="text-sm text-iov-gray-text">{visita.ecogPS !== undefined ? visita.ecogPS : '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Punteggio G8</label>
              <p className="text-sm text-iov-gray-text">{visita.punteggioG8 !== undefined ? visita.punteggioG8 : '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Esito VGM</label>
              <p className="text-sm text-iov-gray-text">{visita.esitoVGM || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Quesito per Geriatra</label>
              <div className="text-sm text-iov-gray-text">
                {visita.quesitoGeriatra && visita.quesitoGeriatra.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {visita.quesitoGeriatra.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medico Referente</label>
              <p className="text-sm text-iov-gray-text font-medium">{visita.medicoReferente || '-'}</p>
            </div>
          </div>
        );
      case 'Osteoncologia':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Problemi</label>
              <p className="text-sm text-iov-gray-text">{visita.problemi || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Quesito</label>
              <p className="text-sm text-iov-gray-text">{visita.quesito || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medico Referente</label>
              <p className="text-sm text-iov-gray-text font-medium">{visita.medicoReferente || '-'}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (selectedVisita) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedVisita(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <Eye className="w-5 h-5 rotate-180" />
          Torna all'elenco
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-iov-light-blue">
            <div>
              <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Dettagli Visita</h2>
              <p className="text-gray-500 text-sm">ID Visita: {selectedVisita.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-iov-light-blue-light text-iov-dark-blue font-semibold text-sm">
                {selectedVisita.ambulatorio}
              </span>
              {selectedVisita.tipo === 'discussione' && (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-semibold text-sm">
                  Discussione
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Dati Paziente */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dati Paziente</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.paziente.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.paziente.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Codice Fiscale</label>
                  <p className="text-lg font-mono font-semibold text-iov-gray-text">{selectedVisita.paziente.codiceFiscale}</p>
                </div>
              </div>
            </div>

            {/* Dati Visita */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dati Visita</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.data}</p>
                </div>
                {selectedVisita.ora && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ora</label>
                    <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.ora}</p>
                  </div>
                )}
                {selectedVisita.tipo && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo</label>
                    <p className="text-lg font-semibold text-iov-gray-text capitalize">{selectedVisita.tipo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dettagli Specifici Ambulatorio */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dettagli {selectedVisita.ambulatorio}</h3>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                {renderDettagliAmbulatorio(selectedVisita)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-iov-gray-text flex items-center gap-3">
            <Calendar className="w-8 h-8 text-iov-dark-blue" />
            Visite Giornaliere - {ambulatorio}
          </h2>
        </div>

        {/* Selezione data */}
        <div className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-iov-gray-text mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Seleziona Data
            </label>
            <input
              type="date"
              value={dataSelezionata}
              onChange={(e) => setDataSelezionata(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
          </div>
          {visiteFiltrate.length > 0 && (
            <button
              onClick={handleExportVisite}
              className="flex items-center gap-2 px-6 py-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Download className="w-5 h-5" />
              <span>Esporta Visite</span>
            </button>
          )}
        </div>

        {/* Lista visite */}
        {visiteFiltrate.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nessuna visita presente per questa data
          </div>
        ) : (
          <div className="space-y-4">
            {visiteFiltrate
              .sort((a, b) => {
                if (!a.ora && !b.ora) return 0;
                if (!a.ora) return 1;
                if (!b.ora) return -1;
                return a.ora.localeCompare(b.ora);
              })
              .map((visita) => (
                <div
                  key={visita.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-iov-dark-blue"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        {visita.ora && (
                          <div className="flex items-center gap-2 bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-semibold">
                            <Clock className="w-5 h-5" />
                            {visita.ora}
                          </div>
                        )}
                        {visita.tipo === 'discussione' && (
                          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold border-2 border-yellow-300">
                            <Stethoscope className="w-5 h-5" />
                            Discussione
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-iov-dark-blue" />
                          <span className="text-xl font-bold text-iov-gray-text">
                            {visita.paziente.nome} {visita.paziente.cognome}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Codice Fiscale</label>
                          <p className="text-sm text-iov-gray-text font-mono">{visita.paziente.codiceFiscale}</p>
                        </div>
                      </div>

                      {/* Dettagli specifici per ambulatorio */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {renderDettagliAmbulatorio(visita)}
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => setSelectedVisita(visita)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Dettagli</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VisiteGiornaliere;

