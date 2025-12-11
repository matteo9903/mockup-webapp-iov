import { useState } from 'react';
import { ArrowLeft, Calendar, Filter, Search, Eye, User, Stethoscope, FileCheck, AlertCircle, FileText, Download, ExternalLink } from 'lucide-react';
import { VisitaStorico, Ambulatorio, PDTA } from './types';

interface StoricoVisiteProps {
  onBack: () => void;
}

// Mock data - in produzione verrà da un'API
const mockVisite: VisitaStorico[] = [
  {
    id: '1',
    codiceFiscale: 'RSSMRA80A01H501U',
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '01-01-1980',
    dataVisita: '25-01-2024',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Polmone',
    stato: 'completata',
    dataRichiesta: '15-01-2024',
    orarioRichiesta: '14:30',
    quesito: 'Valutazione per terapia combinata chemio-radioterapia. Paziente con neoplasia polmonare localmente avanzata. Necessità di valutazione multidisciplinare per definire il miglior approccio terapeutico.',
    impegnativaFile: 'impegnativa_rossi_mario_20240115.pdf',
    score: 5,
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Dolore', 'Dispnea'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Ematologica',
    problemiSocioAssistenziali: 'Nessuno',
  },
  {
    id: '2',
    codiceFiscale: 'BNCGNN75B15L219X',
    nome: 'Giovanna',
    cognome: 'Bianchi',
    dataNascita: '15-02-1975',
    dataVisita: '24-01-2024',
    ambulatorio: 'Osteoncologia',
    patologia: 'Mammella',
    stato: 'completata',
    dataRichiesta: '20-01-2024',
    orarioRichiesta: '09:15',
    quesito: 'Valutazione metastasi ossee multiple. Paziente con carcinoma mammario metastatico. Necessità di valutazione per trattamento delle lesioni ossee e gestione del dolore.',
    impegnativaFile: 'impegnativa_bianchi_giovanna_20240120.pdf',
    score: 8,
    livelloUrgenza: '6-9',
    uoRiferimento: 'UOC Oncologia 1',
    sopravvivenzaStimata: '6-12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee. Necessità di discussione multidisciplinare per definire strategia terapeutica ottimale considerando le condizioni generali del paziente.',
    richiestaPer: ['visita', 'discussione'],
    psKarnofsky: '80',
    segniSintomi: 'Dolore scheletrico',
    metastasiViscerali: 'Oligometastasi viscerali',
    nMetastasiVertebrali: '2',
    sedeMalattiaPrimitiva: 'Mammella',
  },
  {
    id: '3',
    codiceFiscale: 'VRDLCA90C20F205Z',
    nome: 'Luca',
    cognome: 'Verdi',
    dataNascita: '20-03-1990',
    dataVisita: '23-01-2024',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Colon',
    stato: 'completata',
    dataRichiesta: '18-01-2024',
    orarioRichiesta: '11:45',
    quesito: 'Valutazione oncogeriatrica per paziente anziano con neoplasia del colon. Necessità di valutazione della fragilità e adattamento del trattamento oncologico.',
    impegnativaFile: 'impegnativa_verdi_luca_20240118.pdf',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 1,
    punteggioG8: 14,
    esitoVGM: 'fit',
    propostaTerapeutica: 'terapia standard - dosi standard',
    prognosiOncologica: '12-24 mesi',
    finalitaTerapia: ['Aumento OS / PFS', 'Miglioramento sintomi / qualità di vita'],
    tossicitaEmatologica: 15,
    tossicitaExtraEmatologica: 10,
    quesitiGeriatra: [
      'Attuabilità programma proposto',
      'Necessità di presa in carico durante la terapia: Geriatrica',
      'Revisione polifarmacoterapia',
    ],
    programmaAttuabile: true,
    presaInCaricoGeriatrica: true,
    presaInCaricoGeriatricaTempistica: 'Durante tutto il ciclo di trattamento, con controlli mensili',
    revisionePolifarmacoterapia: true,
    revisionePolifarmacoterapiaDettaglio: 'riduzione numero totale di farmaci',
  },
  {
    id: '4',
    codiceFiscale: 'NRIFRN85D10H501T',
    nome: 'Francesca',
    cognome: 'Neri',
    dataNascita: '10-04-1985',
    dataVisita: '22-01-2024',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Prostata',
    stato: 'completata',
    dataRichiesta: '22-01-2024',
    orarioRichiesta: '16:20',
    quesito: 'Valutazione per trattamento combinato chemio-radioterapia in paziente con carcinoma prostatico localmente avanzato.',
    impegnativaFile: 'impegnativa_neri_francesca_20240122.pdf',
    score: 3,
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Dolore'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Nessuna',
    problemiSocioAssistenziali: 'Rete familiare scarsa',
  },
  {
    id: '5',
    codiceFiscale: 'BLUMRC70E25L219Y',
    nome: 'Marco',
    cognome: 'Blu',
    dataNascita: '25-05-1970',
    dataVisita: '26-01-2024',
    ambulatorio: 'Osteoncologia',
    patologia: 'Prostata',
    stato: 'completata',
    dataRichiesta: '25-01-2024',
    orarioRichiesta: '08:00',
    quesito: 'Valutazione urgente per compressione midollare. Paziente con metastasi vertebrali multiple e sintomi neurologici in peggioramento.',
    impegnativaFile: 'impegnativa_blu_marco_20240125.pdf',
    score: 12,
    livelloUrgenza: 'URG',
    uoRiferimento: 'Radioterapia',
    sopravvivenzaStimata: '≥12 mesi',
    quesitoTeam: 'Valutazione urgente per compressione midollare. Necessità di trattamento radioterapico urgente e valutazione ortopedica.',
    richiestaPer: ['visita'],
    psKarnofsky: '≤ 70',
    segniSintomi: 'Sintomi da compressione',
    metastasiViscerali: 'Nessuna viscerale',
    nMetastasiVertebrali: '≥ 3',
    sedeMalattiaPrimitiva: 'Prostata',
    situazioniUrgenti: ['Compressione midollare'],
  },
];

function StoricoVisite({ onBack }: StoricoVisiteProps) {
  const [visite] = useState<VisitaStorico[]>(mockVisite);
  const [selectedVisita, setSelectedVisita] = useState<VisitaStorico | null>(null);
  const [filtroData, setFiltroData] = useState<string>('');
  const [filtroAmbulatorio, setFiltroAmbulatorio] = useState<string>('');
  const [filtroPatologia, setFiltroPatologia] = useState<string>('');
  const [filtroStato, setFiltroStato] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const visiteFiltrate = visite.filter(visita => {
    // Filtro per data
    if (filtroData && visita.dataVisita !== filtroData) return false;
    
    // Filtro per ambulatorio
    if (filtroAmbulatorio && visita.ambulatorio !== filtroAmbulatorio) return false;
    
    // Filtro per patologia
    if (filtroPatologia && visita.patologia !== filtroPatologia) return false;
    
    // Filtro per stato
    if (filtroStato && visita.stato !== filtroStato) return false;
    
    // Filtro per ricerca
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      visita.nome.toLowerCase().includes(searchLower) ||
      visita.cognome.toLowerCase().includes(searchLower) ||
      visita.codiceFiscale.toLowerCase().includes(searchLower) ||
      visita.ambulatorio.toLowerCase().includes(searchLower) ||
      visita.patologia.toLowerCase().includes(searchLower)
    );
  });

  // Tutti i valori possibili per i filtri
  const tuttiAmbulatori: Ambulatorio[] = ['Cure Simultanee', 'Oncogeriatria', 'Osteoncologia'];
  const tuttePatologie: PDTA[] = [
    'Prostata',
    'Polmone',
    'Colon',
    'Retto',
    'Stomaco',
    'Sarcomi dei tessuti molli',
    'Melanoma',
    'Mammella',
    'Sistema nervoso centrale',
  ];

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'completata':
        return 'bg-green-100 text-green-800';
      case 'annullata':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPDF = (filename: string) => {
    // In produzione, questo aprirebbe il PDF reale
    alert(`Demo: Apertura PDF ${filename}`);
  };

  const renderScoreDetails = (visita: VisitaStorico) => {
    if (visita.ambulatorio === 'Oncogeriatria') {
      return null; // Oncogeriatria non ha score clinico
    }

    return (
      <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-iov-dark-blue flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-iov-gray-text">Dettagli Score Clinico</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {visita.ambulatorio === 'Cure Simultanee' && (
            <>
              {visita.psKarnofsky && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PS (Karnofsky)</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.psKarnofsky}</p>
                </div>
              )}
              {visita.sopravvivenzaStimataScore && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sopravvivenza Stimata</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.sopravvivenzaStimataScore}</p>
                </div>
              )}
              {visita.sintomi && visita.sintomi.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sintomi</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.sintomi.join(', ')}</p>
                </div>
              )}
              {visita.trattamentiImpatto && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trattamenti con impatto sulla sopravvivenza</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.trattamentiImpatto === 'si' ? 'Sì' : 'No'}</p>
                </div>
              )}
              {visita.tossicitaAttesa && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tossicità Attesa</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.tossicitaAttesa}</p>
                </div>
              )}
              {visita.problemiSocioAssistenziali && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Problemi Socio-Assistenziali</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.problemiSocioAssistenziali}</p>
                </div>
              )}
            </>
          )}
          {visita.ambulatorio === 'Osteoncologia' && (
            <>
              {visita.psKarnofsky && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PS (Karnofsky)</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.psKarnofsky}</p>
                </div>
              )}
              {visita.segniSintomi && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Segni e Sintomi</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.segniSintomi}</p>
                </div>
              )}
              {visita.metastasiViscerali && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Presenza di metastasi viscerali</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.metastasiViscerali}</p>
                </div>
              )}
              {visita.nMetastasiVertebrali && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">N. metastasi vertebrali</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.nMetastasiVertebrali}</p>
                </div>
              )}
              {visita.sedeMalattiaPrimitiva && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sede malattia primitiva</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.sedeMalattiaPrimitiva}</p>
                </div>
              )}
              {visita.situazioniUrgenti && visita.situazioniUrgenti.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200 bg-red-50">
                  <label className="block text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Situazioni Urgenti</label>
                  <p className="text-base font-semibold text-red-700">{visita.situazioniUrgenti.join(', ')}</p>
                </div>
              )}
            </>
          )}
          {visita.ambulatorio !== 'Cure Simultanee' && visita.ambulatorio !== 'Osteoncologia' && (
            <>
              {visita.tosse && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tosse</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.tosse}</p>
                </div>
              )}
              {visita.dolore && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dolore</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.dolore}</p>
                </div>
              )}
              {visita.comorbidita && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Comorbidità</label>
                  <p className="text-base font-semibold text-iov-gray-text">{visita.comorbidita}</p>
                </div>
              )}
            </>
          )}
        </div>
        {visita.score !== undefined && (
          <div className="mt-6 pt-6 border-t-2 border-iov-light-blue bg-gradient-to-r from-iov-dark-blue to-blue-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <label className="block text-xl font-bold text-white">Score Totale</label>
              <span className="text-4xl font-bold text-white bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">{visita.score}</span>
            </div>
          </div>
        )}
        {visita.livelloUrgenza && (
          <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-amber-300">
            <label className="block text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">Livello Urgenza</label>
            <p className="text-2xl font-bold text-amber-900">{visita.livelloUrgenza}</p>
          </div>
        )}
      </div>
    );
  };

  if (selectedVisita) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedVisita(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna all'elenco
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-iov-light-blue">
            <div>
              <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Dettagli Visita</h2>
              <p className="text-gray-500 text-sm">ID Visita: {selectedVisita.id}</p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${getStatoColor(selectedVisita.stato)}`}>
              {selectedVisita.stato === 'completata' ? 'Completata' : 'Annullata'}
            </span>
          </div>
          
          <div className="space-y-8">
            {/* Dati Anagrafici */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dati Anagrafici Paziente</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Codice Fiscale</label>
                  <p className="text-lg font-mono font-semibold text-iov-gray-text">{selectedVisita.codiceFiscale}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data di Nascita</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.dataNascita}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dati Visita */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Ambulatorio</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedVisita.ambulatorio}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Patologia/PDTA</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedVisita.patologia}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Visita</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedVisita.dataVisita}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Richiesta</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedVisita.dataRichiesta} <span className="text-lg font-bold text-[#0D3859]">alle {selectedVisita.orarioRichiesta}</span></p>
              </div>
            </div>
            
            {/* Quesito Diagnostico */}
            {selectedVisita.quesito && (
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <label className="block text-base font-bold text-iov-gray-text">Quesito Diagnostico</label>
                </div>
                <p className="text-base text-iov-gray-text leading-relaxed bg-white p-4 rounded-lg border border-gray-200">{selectedVisita.quesito}</p>
              </div>
            )}

            {/* Impegnativa PDF */}
            {selectedVisita.impegnativaFile && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-iov-dark-blue flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <label className="block text-lg font-bold text-iov-gray-text">Impegnativa</label>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                  <p className="text-base font-semibold text-iov-gray-text mb-1">{selectedVisita.impegnativaFile}</p>
                  <p className="text-sm text-gray-500">Documento PDF caricato</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewPDF(selectedVisita.impegnativaFile!)}
                    className="flex items-center gap-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Apri PDF</span>
                  </button>
                  <button
                    onClick={() => handleViewPDF(selectedVisita.impegnativaFile!)}
                    className="flex items-center gap-2 bg-white border-2 border-iov-dark-blue text-iov-dark-blue hover:bg-iov-light-blue-light px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>Scarica</span>
                  </button>
                </div>
              </div>
            )}

            {/* Campi condizionali per Osteoncologia */}
            {selectedVisita.ambulatorio === 'Osteoncologia' && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-iov-gray-text">Dettagli Osteoncologia</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedVisita.uoRiferimento && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">U.O. di riferimento</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.uoRiferimento}</p>
                    </div>
                  )}
                  {selectedVisita.uoRiferimentoAltro && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">U.O. di riferimento (Altro)</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.uoRiferimentoAltro}</p>
                    </div>
                  )}
                  {selectedVisita.sopravvivenzaStimata && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sopravvivenza stimata</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.sopravvivenzaStimata}</p>
                    </div>
                  )}
                  {selectedVisita.quesitoTeam && (
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesito al team multidisciplinare</label>
                      <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedVisita.quesitoTeam}</p>
                    </div>
                  )}
                  {selectedVisita.richiestaPer && selectedVisita.richiestaPer.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Richiesta per</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.richiestaPer.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Campi condizionali per Oncogeriatria */}
            {selectedVisita.ambulatorio === 'Oncogeriatria' && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-iov-gray-text">Dettagli Oncogeriatria</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedVisita.stadio && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stadio</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.stadio}</p>
                    </div>
                  )}
                  {selectedVisita.finalitaTrattamento && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Finalità del trattamento</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.finalitaTrattamento}</p>
                    </div>
                  )}
                  {selectedVisita.ecogPS !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">ECOG PS</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.ecogPS}</p>
                    </div>
                  )}
                  {selectedVisita.punteggioG8 !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Punteggio G8</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.punteggioG8}</p>
                    </div>
                  )}
                  {selectedVisita.esitoVGM && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Esito VGM</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.esitoVGM}</p>
                    </div>
                  )}
                  {selectedVisita.propostaTerapeutica && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Proposta terapeutica</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.propostaTerapeutica}</p>
                    </div>
                  )}
                  {selectedVisita.prognosiOncologica && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prognosi oncologica</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.prognosiOncologica}</p>
                    </div>
                  )}
                  {selectedVisita.finalitaTerapia && selectedVisita.finalitaTerapia.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Finalità della terapia oncologica</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.finalitaTerapia.join(', ')}</p>
                    </div>
                  )}
                  {selectedVisita.tossicitaEmatologica !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">% Tossicità ematologica G3/G4</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.tossicitaEmatologica}%</p>
                    </div>
                  )}
                  {selectedVisita.tossicitaExtraEmatologica !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">% Tossicità extra-ematologica G3/G4</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.tossicitaExtraEmatologica}%</p>
                    </div>
                  )}
                  {selectedVisita.quesitiGeriatra && selectedVisita.quesitiGeriatra.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesiti per geriatra</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.quesitiGeriatra.join(', ')}</p>
                    </div>
                  )}
                  {selectedVisita.quesitiGeriatraAltro && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesiti per geriatra (Altro)</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.quesitiGeriatraAltro}</p>
                    </div>
                  )}
                  {selectedVisita.programmaAttuabile !== undefined && (
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Programma attuabile senza programmazione altre visite oncogeriatriche</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.programmaAttuabile ? 'Sì' : 'No'}</p>
                    </div>
                  )}
                  {selectedVisita.presaInCaricoGeriatrica && (
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Necessità di presa in carico geriatrica durante la terapia</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.presaInCaricoGeriatricaTempistica}</p>
                    </div>
                  )}
                  {selectedVisita.presaInCaricoAltroSpecialista && (
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Necessità di presa in carico altro specialista</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.presaInCaricoAltroSpecialistaDettaglio}</p>
                    </div>
                  )}
                  {selectedVisita.rischioCognitiveImpairment && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rischio cognitive impairment</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.rischioCognitiveImpairment} {selectedVisita.rischioCognitiveImpairmentDettaglio ? `(${selectedVisita.rischioCognitiveImpairmentDettaglio})` : ''}</p>
                    </div>
                  )}
                  {selectedVisita.revisionePolifarmacoterapia && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Revisione polifarmacoterapia effettuata</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.revisionePolifarmacoterapiaDettaglio}</p>
                    </div>
                  )}
                  {selectedVisita.attivazioneServiziDomiciliari !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Necessità attivazione servizi domiciliari</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisita.attivazioneServiziDomiciliari ? 'Sì' : 'No'}</p>
                    </div>
                  )}
                  {selectedVisita.altroOutput && (
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Altro output Valutazione geriatrica</label>
                      <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedVisita.altroOutput}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dettagli Score Clinico */}
            {renderScoreDetails(selectedVisita)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-iov-gray-text flex items-center gap-3">
            <Calendar className="w-8 h-8 text-iov-dark-blue" />
            Storico Visite
          </h2>
        </div>

        {/* Barre di ricerca e filtri */}
        <div className="mb-6 space-y-4">
          {/* Barra di ricerca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, cognome, codice fiscale, ambulatorio, patologia..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
          </div>
          
          {/* Filtri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro per data */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Data Visita
              </label>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              />
            </div>

            {/* Filtro per ambulatorio */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1">Ambulatorio</label>
              <select
                value={filtroAmbulatorio}
                onChange={(e) => setFiltroAmbulatorio(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              >
                <option value="">Tutti</option>
                {tuttiAmbulatori.map(amb => (
                  <option key={amb} value={amb}>{amb}</option>
                ))}
              </select>
            </div>

            {/* Filtro per patologia */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1">Patologia</label>
              <select
                value={filtroPatologia}
                onChange={(e) => setFiltroPatologia(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              >
                <option value="">Tutte</option>
                {tuttePatologie.map(pat => (
                  <option key={pat} value={pat}>{pat}</option>
                ))}
              </select>
            </div>

            {/* Filtro per stato */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1">Stato</label>
              <select
                value={filtroStato}
                onChange={(e) => setFiltroStato(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              >
                <option value="">Tutti</option>
                <option value="completata">Completata</option>
                <option value="annullata">Annullata</option>
              </select>
            </div>
          </div>

          {/* Pulsante rimuovi filtri */}
          {(filtroData || filtroAmbulatorio || filtroPatologia || filtroStato || searchTerm) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setFiltroData('');
                  setFiltroAmbulatorio('');
                  setFiltroPatologia('');
                  setFiltroStato('');
                  setSearchTerm('');
                }}
                className="text-sm text-iov-gray-text hover:text-iov-dark-blue font-medium"
              >
                Rimuovi tutti i filtri
              </button>
            </div>
          )}
        </div>

        {visiteFiltrate.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {(filtroData || filtroAmbulatorio || filtroPatologia || filtroStato || searchTerm)
              ? 'Nessuna visita trovata con i filtri selezionati' 
              : 'Nessuna visita presente'}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-iov-light-blue-light border-b-2 border-iov-light-blue">
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Paziente</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">CF</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Data Visita</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Ambulatorio</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Patologia</th>
                  <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Stato</th>
                  <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {visiteFiltrate.map((visita, index) => (
                  <tr 
                    key={visita.id} 
                    className={`transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-iov-light-blue-light hover:shadow-sm`}
                  >
                    <td className="py-4 px-4 text-base font-medium text-iov-gray-text whitespace-normal">
                      {visita.nome} {visita.cognome}
                    </td>
                    <td className="py-4 px-4 text-base text-iov-gray-text font-mono whitespace-normal">{visita.codiceFiscale}</td>
                    <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{visita.dataVisita}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-purple-50 text-purple-700 font-medium text-sm whitespace-normal">
                        {visita.ambulatorio}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-sm whitespace-normal">
                        {visita.patologia}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm whitespace-normal ${getStatoColor(visita.stato)}`}>
                        {visita.stato === 'completata' ? 'Completata' : 'Annullata'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedVisita(visita)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Dettagli</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoricoVisite;

