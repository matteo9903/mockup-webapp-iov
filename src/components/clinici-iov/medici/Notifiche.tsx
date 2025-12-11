import { useState } from 'react';
import { ArrowLeft, Bell, Trash2, Search, Eye, User, Calendar, Stethoscope, FileText, FileCheck, AlertCircle, ExternalLink, Download } from 'lucide-react';
import { Notifica, RichiestaPrenotazione } from './types';

interface NotificheProps {
  onBack: () => void;
  notifiche: Notifica[];
  onEliminaNotifica: (id: string) => void;
}

// Mock data delle richieste - in produzione verrà da un'API
const mockRichieste: RichiestaPrenotazione[] = [
  {
    id: '1',
    codiceFiscale: 'RSSMRA80A01H501U',
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '01-01-1980',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Polmone',
    quesito: 'Valutazione per terapia combinata chemio-radioterapia. Paziente con neoplasia polmonare localmente avanzata. Necessità di valutazione multidisciplinare per definire il miglior approccio terapeutico.',
    stato: 'prenotato',
    dataRichiesta: '15-01-2024',
    orarioRichiesta: '14:30',
    score: 5,
    impegnativaFile: 'impegnativa_rossi_mario_20240115.pdf',
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
    ambulatorio: 'Osteoncologia',
    patologia: 'Mammella',
    quesito: 'Valutazione metastasi ossee multiple. Paziente con carcinoma mammario metastatico. Necessità di valutazione per trattamento delle lesioni ossee e gestione del dolore.',
    stato: 'in-attesa',
    dataRichiesta: '20-01-2024',
    orarioRichiesta: '09:15',
    score: 8,
    livelloUrgenza: '6-9',
    impegnativaFile: 'impegnativa_bianchi_giovanna_20240120.pdf',
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
];

function Notifiche({ onBack, notifiche, onEliminaNotifica }: NotificheProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRichiesta, setSelectedRichiesta] = useState<RichiestaPrenotazione | null>(null);

  const handleElimina = (id: string) => {
    onEliminaNotifica(id);
  };

  const handleVisualizzaDettagli = (notifica: Notifica) => {
    const richiesta = mockRichieste.find(r => r.id === notifica.richiestaId);
    if (richiesta) {
      setSelectedRichiesta(richiesta);
    }
  };

  const handleViewPDF = (filename: string) => {
    // In produzione, questo aprirebbe il PDF reale
    alert(`Demo: Apertura PDF ${filename}`);
  };

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'prenotato':
        return 'bg-green-100 text-green-800';
      case 'in-attesa':
        return 'bg-yellow-100 text-yellow-800';
      case 'rifiutato':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatoLabel = (stato: string) => {
    switch (stato) {
      case 'prenotato':
        return 'Prenotato';
      case 'in-attesa':
        return 'In attesa';
      case 'rifiutato':
        return 'Rifiutato';
      default:
        return stato;
    }
  };

  const renderScoreDetails = (richiesta: RichiestaPrenotazione) => {
    if (richiesta.ambulatorio === 'Oncogeriatria') {
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
          {richiesta.ambulatorio === 'Cure Simultanee' && (
            <>
              {richiesta.psKarnofsky && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PS (Karnofsky)</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.psKarnofsky}</p>
                </div>
              )}
              {richiesta.sopravvivenzaStimataScore && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sopravvivenza Stimata</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.sopravvivenzaStimataScore}</p>
                </div>
              )}
              {richiesta.sintomi && richiesta.sintomi.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sintomi</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.sintomi.join(', ')}</p>
                </div>
              )}
              {richiesta.trattamentiImpatto && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trattamenti con impatto sulla sopravvivenza</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.trattamentiImpatto === 'si' ? 'Sì' : 'No'}</p>
                </div>
              )}
              {richiesta.tossicitaAttesa && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tossicità Attesa</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.tossicitaAttesa}</p>
                </div>
              )}
              {richiesta.problemiSocioAssistenziali && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Problemi Socio-Assistenziali</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.problemiSocioAssistenziali}</p>
                </div>
              )}
            </>
          )}
          {richiesta.ambulatorio === 'Osteoncologia' && (
            <>
              {richiesta.psKarnofsky && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PS (Karnofsky)</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.psKarnofsky}</p>
                </div>
              )}
              {richiesta.segniSintomi && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Segni e Sintomi</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.segniSintomi}</p>
                </div>
              )}
              {richiesta.metastasiViscerali && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Presenza di metastasi viscerali</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.metastasiViscerali}</p>
                </div>
              )}
              {richiesta.nMetastasiVertebrali && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">N. metastasi vertebrali</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.nMetastasiVertebrali}</p>
                </div>
              )}
              {richiesta.sedeMalattiaPrimitiva && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sede malattia primitiva</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.sedeMalattiaPrimitiva}</p>
                </div>
              )}
              {richiesta.situazioniUrgenti && richiesta.situazioniUrgenti.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200 bg-red-50">
                  <label className="block text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Situazioni Urgenti</label>
                  <p className="text-base font-semibold text-red-700">{richiesta.situazioniUrgenti.join(', ')}</p>
                </div>
              )}
            </>
          )}
        </div>
        {richiesta.score !== undefined && (
          <div className="mt-6 pt-6 border-t-2 border-iov-light-blue bg-gradient-to-r from-iov-dark-blue to-blue-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <label className="block text-xl font-bold text-white">Score Totale</label>
              <span className="text-4xl font-bold text-white bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">{richiesta.score}</span>
            </div>
          </div>
        )}
        {richiesta.livelloUrgenza && (
          <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-2 border-amber-300">
            <label className="block text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">Livello Urgenza</label>
            <p className="text-2xl font-bold text-amber-900">{richiesta.livelloUrgenza}</p>
          </div>
        )}
      </div>
    );
  };

  // Filtra le notifiche in base al termine di ricerca
  const notificheFiltrate = notifiche.filter(notifica => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      notifica.pazienteNome.toLowerCase().includes(searchLower) ||
      notifica.pazienteCognome.toLowerCase().includes(searchLower) ||
      notifica.codiceFiscale.toLowerCase().includes(searchLower) ||
      notifica.ambulatorio.toLowerCase().includes(searchLower) ||
      notifica.messaggio.toLowerCase().includes(searchLower)
    );
  });

  // Se è selezionata una richiesta, mostra i dettagli
  if (selectedRichiesta) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedRichiesta(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna alle notifiche
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-iov-light-blue">
            <div>
              <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Dettagli Richiesta</h2>
              <p className="text-gray-500 text-sm">ID Richiesta: {selectedRichiesta.id}</p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${getStatoColor(selectedRichiesta.stato)}`}>
              {getStatoLabel(selectedRichiesta.stato)}
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
                  <p className="text-lg font-mono font-semibold text-iov-gray-text">{selectedRichiesta.codiceFiscale}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data di Nascita</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.dataNascita}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dati Richiesta */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Ambulatorio</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedRichiesta.ambulatorio}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Patologia/PDTA</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedRichiesta.patologia}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#0D3859]" />
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Richiesta</label>
                </div>
                <p className="text-lg font-bold text-[#0D3859]">{selectedRichiesta.dataRichiesta} <span className="text-lg font-bold text-[#0D3859]">alle {selectedRichiesta.orarioRichiesta}</span></p>
              </div>
            </div>
            
            {/* Quesito Diagnostico */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <label className="block text-base font-bold text-iov-gray-text">Quesito Diagnostico</label>
              </div>
              <p className="text-base text-iov-gray-text leading-relaxed bg-white p-4 rounded-lg border border-gray-200">{selectedRichiesta.quesito}</p>
            </div>

            {/* Impegnativa PDF */}
            {selectedRichiesta.impegnativaFile && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-iov-dark-blue flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <label className="block text-lg font-bold text-iov-gray-text">Impegnativa</label>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                  <p className="text-base font-semibold text-iov-gray-text mb-1">{selectedRichiesta.impegnativaFile}</p>
                  <p className="text-sm text-gray-500">Documento PDF caricato</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewPDF(selectedRichiesta.impegnativaFile!)}
                    className="flex items-center gap-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Apri PDF</span>
                  </button>
                  <button
                    onClick={() => handleViewPDF(selectedRichiesta.impegnativaFile!)}
                    className="flex items-center gap-2 bg-white border-2 border-iov-dark-blue text-iov-dark-blue hover:bg-iov-light-blue-light px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>Scarica</span>
                  </button>
                </div>
              </div>
            )}

            {/* Campi condizionali per Osteoncologia */}
            {selectedRichiesta.ambulatorio === 'Osteoncologia' && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-iov-gray-text">Dettagli Osteoncologia</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedRichiesta.uoRiferimento && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">U.O. di riferimento</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.uoRiferimento}</p>
                    </div>
                  )}
                  {selectedRichiesta.uoRiferimentoAltro && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">U.O. di riferimento (Altro)</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.uoRiferimentoAltro}</p>
                    </div>
                  )}
                  {selectedRichiesta.sopravvivenzaStimata && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sopravvivenza stimata</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.sopravvivenzaStimata}</p>
                    </div>
                  )}
                  {selectedRichiesta.quesitoTeam && (
                    <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesito al team multidisciplinare</label>
                      <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedRichiesta.quesitoTeam}</p>
                    </div>
                  )}
                  {selectedRichiesta.richiestaPer && selectedRichiesta.richiestaPer.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Richiesta per</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.richiestaPer.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dettagli Score Clinico */}
            {renderScoreDetails(selectedRichiesta)}
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-iov-gray-text flex items-center gap-3">
            <Bell className="w-8 h-8 text-iov-dark-blue" />
            Notifiche
          </h2>
          {notifiche.length > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {notifiche.length} {notifiche.length === 1 ? 'notifica' : 'notifiche'}
            </span>
          )}
        </div>

        {/* Barra di ricerca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, cognome, codice fiscale, ambulatorio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
          </div>
        </div>

        {notifiche.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nessuna notifica presente
          </div>
        ) : notificheFiltrate.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nessuna notifica trovata per "{searchTerm}"
          </div>
        ) : (
          <div className="space-y-4">
              {notificheFiltrate.map((notifica) => (
                <div
                  key={notifica.id}
                  className="border-2 border-iov-dark-blue bg-iov-light-blue-light rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <h3 className="font-semibold text-iov-gray-text">
                          {notifica.pazienteNome} {notifica.pazienteCognome}
                        </h3>
                        <span className="text-sm text-gray-500">({notifica.codiceFiscale})</span>
                      </div>
                      <p className="text-iov-gray-text mb-2">{notifica.messaggio}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Ambulatorio: {notifica.ambulatorio}</span>
                        <span>Data visita: {notifica.dataVisita}</span>
                        <span>Notifica: {new Date(notifica.dataNotifica).toLocaleString('it-IT')}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <button
                        onClick={() => handleVisualizzaDettagli(notifica)}
                        className="p-2 text-iov-dark-blue hover:bg-iov-light-blue rounded-lg transition-colors"
                        title="Visualizza dettagli richiesta"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleElimina(notifica.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina notifica"
                      >
                        <Trash2 className="w-5 h-5" />
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

export default Notifiche;
