import { useState } from 'react';
import { ArrowLeft, User, FileText, Upload, Eye, X, Search, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { PazienteTriage, DocumentoReferto } from './types';
import { pdtaData } from '../../../data/pdtaData';

interface ElencoPazientiProps {
  onBack: () => void;
}

// Mock data per pazienti con triage completato
const mockPazienti: PazienteTriage[] = [
  {
    id: 'p1',
    codiceFiscale: 'RSSMRA80A01H501U',
    nome: 'Mario',
    cognome: 'Rossi',
    dataTriage: '15-01-2024',
    pdtaSelezionato: 'polmone',
    checklistCompletata: {
      'Rx torace': true,
      'TC torace': true,
      'Visita pneumologica': true,
      'Biopsia ed esame istologico': true,
    },
    documentiCaricati: {
      'Rx torace': [
        {
          id: 'doc1',
          nomeVisita: 'Rx torace',
          nomeFile: 'referto_rx_torace_rossi_mario.pdf',
          dataCaricamento: '10-01-2024',
        },
      ],
      'TC torace': [
        {
          id: 'doc2',
          nomeVisita: 'TC torace',
          nomeFile: 'referto_tc_torace_rossi_mario.pdf',
          dataCaricamento: '12-01-2024',
        },
      ],
      'Visita pneumologica': [
        {
          id: 'doc3',
          nomeVisita: 'Visita pneumologica',
          nomeFile: 'referto_visita_pneumologica_rossi_mario.pdf',
          dataCaricamento: '13-01-2024',
        },
      ],
      'Biopsia ed esame istologico': [
        {
          id: 'doc4',
          nomeVisita: 'Biopsia ed esame istologico',
          nomeFile: 'referto_biopsia_rossi_mario.pdf',
          dataCaricamento: '14-01-2024',
        },
      ],
    },
  },
  {
    id: 'p2',
    codiceFiscale: 'BNCGNN75B15L219X',
    nome: 'Giovanna',
    cognome: 'Bianchi',
    dataTriage: '20-01-2024',
    pdtaSelezionato: 'mammella',
    checklistCompletata: {
      'Visita senologica': true,
      'Ecografia mammaria': true,
      'Biopsia ed esame istologico': true,
    },
    documentiCaricati: {
      'Visita senologica': [
        {
          id: 'doc5',
          nomeVisita: 'Visita senologica',
          nomeFile: 'referto_visita_senologica_bianchi_giovanna.pdf',
          dataCaricamento: '18-01-2024',
        },
      ],
      'Ecografia mammaria': [
        {
          id: 'doc6',
          nomeVisita: 'Ecografia mammaria',
          nomeFile: 'referto_ecografia_bianchi_giovanna.pdf',
          dataCaricamento: '19-01-2024',
        },
      ],
      // Biopsia ed esame istologico completata ma senza documento caricato
    },
  },
  {
    id: 'p3',
    codiceFiscale: 'VRDLCA90C20F205Z',
    nome: 'Luca',
    cognome: 'Verdi',
    dataTriage: '22-01-2024',
    pdtaSelezionato: 'colon',
    checklistCompletata: {
      'Visita specialistica': true,
      'Pancolonscopia con biopsia': true,
      'Esame istologico': true,
    },
    documentiCaricati: {
      'Visita specialistica': [
        {
          id: 'doc7',
          nomeVisita: 'Visita specialistica',
          nomeFile: 'referto_visita_specialistica_verdi_luca.pdf',
          dataCaricamento: '21-01-2024',
        },
      ],
      // Pancolonscopia e Esame istologico completati ma senza documenti caricati
    },
  },
  {
    id: 'p4',
    codiceFiscale: 'NRIFRN85D25H501T',
    nome: 'Francesca',
    cognome: 'Neri',
    dataTriage: '18-01-2024',
    pdtaSelezionato: 'prostata',
    checklistCompletata: {
      'Visita urologica': true,
      'PSA': true,
      'Biopsia prostatica': true,
      'RM pelvi': true,
    },
    documentiCaricati: {
      'Visita urologica': [
        {
          id: 'doc8',
          nomeVisita: 'Visita urologica',
          nomeFile: 'referto_visita_urologica_neri_francesca.pdf',
          dataCaricamento: '16-01-2024',
        },
      ],
      'PSA': [
        {
          id: 'doc9',
          nomeVisita: 'PSA',
          nomeFile: 'referto_psa_neri_francesca.pdf',
          dataCaricamento: '17-01-2024',
        },
      ],
      // Biopsia prostatica e RM pelvi completate ma senza documenti caricati
    },
  },
  {
    id: 'p5',
    codiceFiscale: 'BLUMRC88E30F205K',
    nome: 'Marco',
    cognome: 'Blu',
    dataTriage: '25-01-2024',
    pdtaSelezionato: 'melanoma',
    checklistCompletata: {
      'Visita dermatologica': true,
      'Dermoscopia': true,
      'Biopsia cutanea': true,
    },
    documentiCaricati: {
      'Visita dermatologica': [
        {
          id: 'doc10',
          nomeVisita: 'Visita dermatologica',
          nomeFile: 'referto_visita_dermatologica_blu_marco.pdf',
          dataCaricamento: '23-01-2024',
        },
      ],
      'Dermoscopia': [
        {
          id: 'doc11',
          nomeVisita: 'Dermoscopia',
          nomeFile: 'referto_dermoscopia_blu_marco.pdf',
          dataCaricamento: '24-01-2024',
        },
      ],
      'Biopsia cutanea': [
        {
          id: 'doc12',
          nomeVisita: 'Biopsia cutanea',
          nomeFile: 'referto_biopsia_cutanea_blu_marco.pdf',
          dataCaricamento: '25-01-2024',
        },
      ],
    },
  },
  {
    id: 'p6',
    codiceFiscale: 'GRNPLA82F12H501M',
    nome: 'Paola',
    cognome: 'Grigia',
    dataTriage: '19-01-2024',
    pdtaSelezionato: 'stomaco',
    checklistCompletata: {
      'Visita gastroenterologica': true,
      'Gastroscopia': true,
      'Biopsia gastrica': true,
    },
    documentiCaricati: {
      'Visita gastroenterologica': [
        {
          id: 'doc13',
          nomeVisita: 'Visita gastroenterologica',
          nomeFile: 'referto_visita_gastroenterologica_grigia_paola.pdf',
          dataCaricamento: '17-01-2024',
        },
      ],
      // Gastroscopia e Biopsia gastrica completate ma senza documenti caricati
    },
  },
  {
    id: 'p7',
    codiceFiscale: 'RSSGPP70A01H501N',
    nome: 'Giuseppe',
    cognome: 'Rosso',
    dataTriage: '16-01-2024',
    pdtaSelezionato: 'retto',
    checklistCompletata: {
      'Visita proctologica': true,
      'Colonscopia': true,
      'Biopsia rettale': true,
      'RM pelvi': true,
    },
    documentiCaricati: {
      'Visita proctologica': [
        {
          id: 'doc14',
          nomeVisita: 'Visita proctologica',
          nomeFile: 'referto_visita_proctologica_rosso_giuseppe.pdf',
          dataCaricamento: '14-01-2024',
        },
      ],
      'Colonscopia': [
        {
          id: 'doc15',
          nomeVisita: 'Colonscopia',
          nomeFile: 'referto_colonscopia_rosso_giuseppe.pdf',
          dataCaricamento: '15-01-2024',
        },
      ],
      'Biopsia rettale': [
        {
          id: 'doc16',
          nomeVisita: 'Biopsia rettale',
          nomeFile: 'referto_biopsia_rettale_rosso_giuseppe.pdf',
          dataCaricamento: '15-01-2024',
        },
      ],
      'RM pelvi': [
        {
          id: 'doc17',
          nomeVisita: 'RM pelvi',
          nomeFile: 'referto_rm_pelvi_rosso_giuseppe.pdf',
          dataCaricamento: '16-01-2024',
        },
      ],
    },
  },
];

function ElencoPazienti({ onBack }: ElencoPazientiProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaziente, setSelectedPaziente] = useState<PazienteTriage | null>(null);
  const [pazienti, setPazienti] = useState<PazienteTriage[]>(mockPazienti);

  const pazientiFiltrati = pazienti.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadReferto = (pazienteId: string, visita: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const nuovoDocumento: DocumentoReferto = {
        id: `doc-${Date.now()}-${Math.random()}`,
        nomeVisita: visita,
        nomeFile: file.name,
        dataCaricamento: new Date().toISOString().split('T')[0],
      };

      // Aggiorna lo stato dei pazienti
      setPazienti(prev => prev.map(p => {
        if (p.id === pazienteId) {
          const updatedPaziente = {
            ...p,
            documentiCaricati: {
              ...p.documentiCaricati,
              [visita]: [...(p.documentiCaricati[visita] || []), nuovoDocumento],
            },
          };
          // Aggiorna anche il paziente selezionato
          if (selectedPaziente?.id === pazienteId) {
            setSelectedPaziente(updatedPaziente);
          }
          return updatedPaziente;
        }
        return p;
      }));
      alert('Referto caricato con successo!');
    }
  };

  const handleRimuoviReferto = (pazienteId: string, visita: string, docId: string) => {
    setPazienti(prev => prev.map(p => {
      if (p.id === pazienteId) {
        const updatedPaziente = {
          ...p,
          documentiCaricati: {
            ...p.documentiCaricati,
            [visita]: (p.documentiCaricati[visita] || []).filter(doc => doc.id !== docId),
          },
        };
        // Aggiorna anche il paziente selezionato
        if (selectedPaziente?.id === pazienteId) {
          setSelectedPaziente(updatedPaziente);
        }
        return updatedPaziente;
      }
      return p;
    }));
  };

  if (selectedPaziente) {
    const visiteCompletate = Object.keys(selectedPaziente.checklistCompletata).filter(
      visita => selectedPaziente.checklistCompletata[visita]
    );

    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedPaziente(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna all'elenco
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-iov-light-blue">
            <div>
              <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Documentazione Paziente</h2>
              <p className="text-gray-500 text-sm">
                {selectedPaziente.nome} {selectedPaziente.cognome} - CF: {selectedPaziente.codiceFiscale}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Triage: {selectedPaziente.dataTriage}</span>
              </div>
              <div className="px-3 py-1 bg-iov-light-blue-light rounded-lg border border-iov-light-blue">
                <span className="text-sm font-semibold text-iov-dark-blue">
                  PDTA: {pdtaData.find(p => p.id === selectedPaziente.pdtaSelezionato)?.name || selectedPaziente.pdtaSelezionato}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {visiteCompletate.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nessuna visita completata per questo paziente
              </div>
            ) : (
              visiteCompletate.map((visita) => {
                const documenti = selectedPaziente.documentiCaricati[visita] || [];
                return (
                  <div
                    key={visita}
                    className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-iov-dark-blue flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-iov-gray-text">{visita}</h3>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg cursor-pointer transition-all font-medium text-sm">
                        <Upload className="w-4 h-4" />
                        <span>Carica Referto</span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleUploadReferto(selectedPaziente.id, visita, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {documenti.length === 0 ? (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                        <p className="text-yellow-800 text-sm font-medium">
                          Nessun referto caricato per questa visita
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {documenti.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between bg-white border-2 border-green-200 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <FileText className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-semibold text-iov-gray-text">{doc.nomeFile}</p>
                                <p className="text-xs text-gray-500">Caricato il {doc.dataCaricamento}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  // Mock: apri PDF
                                  alert(`Apertura referto: ${doc.nomeFile}`);
                                }}
                                className="p-2 text-iov-dark-blue hover:text-iov-dark-blue-hover transition-colors"
                                title="Visualizza referto"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Sei sicuro di voler rimuovere questo referto?')) {
                                    handleRimuoviReferto(selectedPaziente.id, visita, doc.id);
                                  }
                                }}
                                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                                title="Rimuovi referto"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-3xl font-bold text-iov-gray-text mb-6 flex items-center gap-3">
          <Users className="w-8 h-8 text-iov-dark-blue" />
          Elenco Pazienti
        </h2>

        {/* Barra di ricerca */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-iov-gray-text mb-2 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Cerca paziente
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca per nome, cognome o codice fiscale"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
          />
        </div>
      </div>

      {/* Lista pazienti */}
      {pazientiFiltrati.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Nessun paziente trovato</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pazientiFiltrati.map((paziente) => {
            const visiteCompletate = Object.keys(paziente.checklistCompletata).filter(
              visita => paziente.checklistCompletata[visita]
            );
            
            // Calcola visite con documenti caricati
            const visiteConDocumenti = visiteCompletate.filter(
              visita => paziente.documentiCaricati[visita] && paziente.documentiCaricati[visita].length > 0
            );
            const percentualeCompletamento = visiteCompletate.length > 0 
              ? Math.round((visiteConDocumenti.length / visiteCompletate.length) * 100)
              : 0;
            const pdtaNome = pdtaData.find(p => p.id === paziente.pdtaSelezionato)?.name || paziente.pdtaSelezionato;

            return (
              <div
                key={paziente.id}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-iov-dark-blue transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-iov-gray-text">
                          {paziente.nome} {paziente.cognome}
                        </h3>
                        <p className="text-sm text-gray-600 font-mono">{paziente.codiceFiscale}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Data Triage
                        </label>
                        <p className="text-sm font-semibold text-iov-gray-text">{paziente.dataTriage}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          PDTA di Riferimento
                        </label>
                        <p className="text-sm font-semibold text-iov-gray-text">{pdtaNome}</p>
                      </div>
                    </div>

                    {/* Barra di avanzamento */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Caricamento Documenti
                        </label>
                        <span className="text-xs font-semibold text-iov-gray-text">
                          {visiteConDocumenti.length} / {visiteCompletate.length} visite con documenti
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percentualeCompletamento === 100
                              ? 'bg-green-500'
                              : percentualeCompletamento >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percentualeCompletamento}%` }}
                        />
                      </div>
                      {percentualeCompletamento === 100 ? (
                        <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Tutti i documenti sono stati caricati
                        </p>
                      ) : (
                        <p className="text-xs text-amber-600 font-medium mt-1">
                          Mancano documenti per {visiteCompletate.length - visiteConDocumenti.length} visita/e
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => {
                        const pazienteAggiornato = pazienti.find(p => p.id === paziente.id);
                        setSelectedPaziente(pazienteAggiornato || paziente);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Dettagli Documentazione</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ElencoPazienti;

