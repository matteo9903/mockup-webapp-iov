import { useState } from 'react';
import { ArrowLeft, Eye, FileText, Search, Filter, Download, ExternalLink, User, Calendar, Stethoscope, FileCheck, AlertCircle } from 'lucide-react';
import { RichiestaPrenotazione, Ambulatorio, PDTA } from './types';

interface ElencoRichiesteProps {
  onBack: () => void;
}

// Mock data - in produzione verrà da un'API
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
    dataPrenotazione: '02-02-2024',
    orarioPrenotazione: '09:15',
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
  {
    id: '3',
    codiceFiscale: 'VRDLCA90C20F205Z',
    nome: 'Luca',
    cognome: 'Verdi',
    dataNascita: '20-03-1990',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Colon',
    quesito: 'Valutazione oncogeriatrica per paziente anziano con neoplasia del colon. Necessità di valutazione della fragilità e adattamento del trattamento oncologico.',
    stato: 'prenotato',
    dataRichiesta: '18-01-2024',
    orarioRichiesta: '11:45',
    dataPrenotazione: '05-02-2024',
    orarioPrenotazione: '10:30',
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
    ambulatorio: 'Cure Simultanee',
    patologia: 'Prostata',
    quesito: 'Valutazione per trattamento combinato chemio-radioterapia in paziente con carcinoma prostatico localmente avanzato.',
    stato: 'in-attesa',
    dataRichiesta: '22-01-2024',
    orarioRichiesta: '16:20',
    score: 3,
    impegnativaFile: 'impegnativa_neri_francesca_20240122.pdf',
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
    ambulatorio: 'Osteoncologia',
    patologia: 'Prostata',
    quesito: 'Valutazione urgente per compressione midollare. Paziente con metastasi vertebrali multiple e sintomi neurologici in peggioramento.',
    stato: 'prenotato',
    dataRichiesta: '25-01-2024',
    orarioRichiesta: '08:00',
    dataPrenotazione: '30-01-2024',
    orarioPrenotazione: '08:45',
    score: 12,
    livelloUrgenza: 'URG',
    impegnativaFile: 'impegnativa_blu_marco_20240125.pdf',
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
  {
    id: '6',
    codiceFiscale: 'GRNPLA88F15F205W',
    nome: 'Paola',
    cognome: 'Gialli',
    dataNascita: '15-06-1988',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Mammella',
    quesito: 'Valutazione oncogeriatrica per paziente fragile con neoplasia mammaria. Necessità di adattamento terapeutico.',
    stato: 'in-attesa',
    dataRichiesta: '19-01-2024',
    orarioRichiesta: '13:10',
    impegnativaFile: 'impegnativa_gialli_paola_20240119.pdf',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 2,
    punteggioG8: 10,
    esitoVGM: 'vulnerabile',
    propostaTerapeutica: 'terapia standard - dosi ridotte (eventualmente da aumentare)',
    prognosiOncologica: '<12 mesi',
    finalitaTerapia: ['Miglioramento sintomi / qualità di vita'],
    tossicitaEmatologica: 25,
    tossicitaExtraEmatologica: 20,
    quesitiGeriatra: [
      'Necessità di presa in carico durante la terapia: Geriatrica',
      'Necessità di presa in carico durante la terapia: Di altro specialista',
      'Valutazione rischio cognitive impairment',
      'Revisione polifarmacoterapia',
      'Altro',
    ],
    quesitiGeriatraAltro: 'Valutazione supporto psicologico e assistenza domiciliare',
    programmaAttuabile: false,
    presaInCaricoGeriatrica: true,
    presaInCaricoGeriatricaTempistica: 'Durante tutto il trattamento con controlli settimanali',
    presaInCaricoAltroSpecialista: true,
    presaInCaricoAltroSpecialistaDettaglio: 'Supporto psicologico e assistenza sociale',
    rischioCognitiveImpairment: 'moderato',
    revisionePolifarmacoterapia: true,
    revisionePolifarmacoterapiaDettaglio: 'farmaci modificati, stesso numero totale',
    attivazioneServiziDomiciliari: true,
    altroOutput: 'Necessità di supporto assistenziale domiciliare e valutazione caregiver',
  },
  {
    id: '7',
    codiceFiscale: 'RSSGPP65F12H501K',
    nome: 'Giuseppe',
    cognome: 'Rosso',
    dataNascita: '12-06-1965',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Retto',
    quesito: 'Valutazione per trattamento combinato in paziente con carcinoma del retto. Necessità di valutazione multidisciplinare per definire strategia terapeutica.',
    stato: 'prenotato',
    dataRichiesta: '16-01-2024',
    orarioRichiesta: '10:00',
    dataPrenotazione: '29-01-2024',
    orarioPrenotazione: '11:15',
    score: 6,
    impegnativaFile: 'impegnativa_rosso_giuseppe_20240116.pdf',
    psKarnofsky: '50-60',
    sopravvivenzaStimataScore: '6-12 mesi',
    sintomi: ['Dolore', 'Iporessia', 'Calo Ponderale'],
    trattamentiImpatto: 'No',
    tossicitaAttesa: 'Mucosite',
    problemiSocioAssistenziali: 'Inadeguato supporto',
  },
  {
    id: '8',
    codiceFiscale: 'BNCMRC82G25L219M',
    nome: 'Marco',
    cognome: 'Bianco',
    dataNascita: '25-07-1982',
    ambulatorio: 'Osteoncologia',
    patologia: 'Polmone',
    quesito: 'Valutazione per metastasi ossee da carcinoma polmonare. Necessità di trattamento delle lesioni ossee.',
    stato: 'in-attesa',
    dataRichiesta: '21-01-2024',
    orarioRichiesta: '15:30',
    score: 7,
    livelloUrgenza: '6-9',
    impegnativaFile: 'impegnativa_bianco_marco_20240121.pdf',
    uoRiferimento: 'UOC Oncologia 2',
    sopravvivenzaStimata: '6-12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee multiple. Necessità di discussione multidisciplinare.',
    richiestaPer: ['visita'],
    psKarnofsky: '80',
    segniSintomi: 'Dolore scheletrico',
    metastasiViscerali: 'Multiple lesioni viscerali',
    nMetastasiVertebrali: '≥ 3',
    sedeMalattiaPrimitiva: 'Polmone',
  },
  {
    id: '9',
    codiceFiscale: 'VRDFRN78H08F205N',
    nome: 'Francesca',
    cognome: 'Verde',
    dataNascita: '08-08-1978',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Stomaco',
    quesito: 'Valutazione oncogeriatrica per paziente anziano con neoplasia gastrica. Necessità di valutazione della fragilità.',
    stato: 'rifiutato',
    dataRichiesta: '17-01-2024',
    orarioRichiesta: '12:00',
    impegnativaFile: 'impegnativa_verde_francesca_20240117.pdf',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 3,
    punteggioG8: 8,
    esitoVGM: 'fragile',
    propostaTerapeutica: 'terapia standard - dosi ridotte (non previsto aumento dosi)',
    prognosiOncologica: '<12 mesi',
    finalitaTerapia: ['Miglioramento sintomi / qualità di vita'],
    tossicitaEmatologica: 30,
    tossicitaExtraEmatologica: 25,
    quesitiGeriatra: [
      'Valutazione rischio cognitive impairment',
      'Revisione polifarmacoterapia',
    ],
    rischioCognitiveImpairment: 'alto',
    revisionePolifarmacoterapia: true,
    revisionePolifarmacoterapiaDettaglio: 'riduzione numero totale di farmaci',
  },
  {
    id: '10',
    codiceFiscale: 'NRIMRC88I15H501P',
    nome: 'Marco',
    cognome: 'Nero',
    dataNascita: '15-09-1988',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Melanoma',
    quesito: 'Valutazione per trattamento combinato in paziente con melanoma avanzato. Necessità di valutazione multidisciplinare.',
    stato: 'prenotato',
    dataRichiesta: '23-01-2024',
    orarioRichiesta: '11:00',
    dataPrenotazione: '01-02-2024',
    orarioPrenotazione: '12:00',
    score: 4,
    impegnativaFile: 'impegnativa_nero_marco_20240123.pdf',
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Dolore', 'Ansia Depressione'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Altro',
    problemiSocioAssistenziali: 'Limitazioni assistenziali',
  },
  {
    id: '11',
    codiceFiscale: 'BLUPLA72J20L219Q',
    nome: 'Paola',
    cognome: 'Blu',
    dataNascita: '20-10-1972',
    ambulatorio: 'Osteoncologia',
    patologia: 'Colon',
    quesito: 'Valutazione per frattura patologica. Paziente con metastasi ossee da carcinoma del colon.',
    stato: 'prenotato',
    dataRichiesta: '24-01-2024',
    orarioRichiesta: '09:30',
    dataPrenotazione: '03-02-2024',
    orarioPrenotazione: '09:00',
    score: 11,
    livelloUrgenza: 'URG',
    impegnativaFile: 'impegnativa_blu_paola_20240124.pdf',
    uoRiferimento: 'UOC Oncologia 3',
    sopravvivenzaStimata: '≥12 mesi',
    quesitoTeam: 'Valutazione urgente per frattura patologica. Necessità di trattamento ortopedico e radioterapico.',
    richiestaPer: ['visita', 'discussione'],
    psKarnofsky: '≤ 70',
    segniSintomi: 'Dolore scheletrico',
    metastasiViscerali: 'Oligometastasi viscerali',
    nMetastasiVertebrali: '2',
    sedeMalattiaPrimitiva: 'Colon',
    situazioniUrgenti: ['Frattura patologica'],
  },
  {
    id: '12',
    codiceFiscale: 'GRNMRC85K05F205R',
    nome: 'Marco',
    cognome: 'Giallo',
    dataNascita: '05-11-1985',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Prostata',
    quesito: 'Valutazione oncogeriatrica per paziente anziano con carcinoma prostatico. Necessità di adattamento terapeutico.',
    stato: 'in-attesa',
    dataRichiesta: '26-01-2024',
    orarioRichiesta: '14:00',
    impegnativaFile: 'impegnativa_giallo_marco_20240126.pdf',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 0,
    punteggioG8: 16,
    esitoVGM: 'fit',
    propostaTerapeutica: 'terapia standard - dosi standard',
    prognosiOncologica: '>24 mesi',
    finalitaTerapia: ['Aumento OS / PFS'],
    tossicitaEmatologica: 12,
    tossicitaExtraEmatologica: 8,
    quesitiGeriatra: [
      'Attuabilità programma proposto',
      'Valutazione rischio cognitive impairment',
    ],
    programmaAttuabile: true,
    rischioCognitiveImpairment: 'basso',
  },
];

function ElencoRichieste({ onBack }: ElencoRichiesteProps) {
  const [richieste] = useState<RichiestaPrenotazione[]>(mockRichieste);
  const [selectedRichiesta, setSelectedRichiesta] = useState<RichiestaPrenotazione | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroData, setFiltroData] = useState<string>('');
  const [filtroAmbulatorio, setFiltroAmbulatorio] = useState<string>('');
  const [filtroPatologia, setFiltroPatologia] = useState<string>('');
  const [filtroStato, setFiltroStato] = useState<string>('');

  const richiesteFiltrate = richieste.filter(richiesta => {
    // Filtro per data
    if (filtroData && richiesta.dataRichiesta !== filtroData) return false;
    
    // Filtro per ambulatorio
    if (filtroAmbulatorio && richiesta.ambulatorio !== filtroAmbulatorio) return false;
    
    // Filtro per patologia
    if (filtroPatologia && richiesta.patologia !== filtroPatologia) return false;
    
    // Filtro per stato
    if (filtroStato && richiesta.stato !== filtroStato) return false;
    
    // Filtro per ricerca
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      richiesta.nome.toLowerCase().includes(searchLower) ||
      richiesta.cognome.toLowerCase().includes(searchLower) ||
      richiesta.codiceFiscale.toLowerCase().includes(searchLower) ||
      richiesta.ambulatorio.toLowerCase().includes(searchLower) ||
      richiesta.patologia.toLowerCase().includes(searchLower) ||
      richiesta.quesito.toLowerCase().includes(searchLower)
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

  const handleViewPDF = (filename: string) => {
    // In produzione, questo aprirebbe il PDF reale
    alert(`Demo: Apertura PDF ${filename}`);
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
          {richiesta.ambulatorio !== 'Cure Simultanee' && richiesta.ambulatorio !== 'Osteoncologia' && (
            <>
              {richiesta.tosse && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tosse</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.tosse}</p>
                </div>
              )}
              {richiesta.dolore && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dolore</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.dolore}</p>
                </div>
              )}
              {richiesta.comorbidita && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Comorbidità</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiesta.comorbidita}</p>
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

  if (selectedRichiesta) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedRichiesta(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna all'elenco
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
            
            {selectedRichiesta.stato === 'prenotato' && selectedRichiesta.dataPrenotazione && selectedRichiesta.orarioPrenotazione && (
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900">Slot prenotato</h3>
                    <p className="text-sm text-emerald-800/80">Informazioni su data e orario assegnati</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data prenotazione</label>
                    <p className="text-lg font-semibold text-emerald-900">{selectedRichiesta.dataPrenotazione}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Orario</label>
                    <p className="text-lg font-semibold text-emerald-900">{selectedRichiesta.orarioPrenotazione}</p>
                  </div>
                </div>
              </div>
            )}
            
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

            {/* Campi condizionali per Oncogeriatria */}
            {selectedRichiesta.ambulatorio === 'Oncogeriatria' && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-iov-gray-text">Dettagli Oncogeriatria</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedRichiesta.stadio && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stadio</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.stadio}</p>
                    </div>
                  )}
                  {selectedRichiesta.finalitaTrattamento && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Finalità del trattamento</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.finalitaTrattamento}</p>
                    </div>
                  )}
                  {selectedRichiesta.ecogPS !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">ECOG PS</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.ecogPS}</p>
                    </div>
                  )}
                  {selectedRichiesta.punteggioG8 !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Punteggio G8</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.punteggioG8}</p>
                    </div>
                  )}
                  {selectedRichiesta.esitoVGM && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Esito VGM</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.esitoVGM}</p>
                    </div>
                  )}
                  {selectedRichiesta.propostaTerapeutica && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Proposta terapeutica</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.propostaTerapeutica}</p>
                    </div>
                  )}
                  {selectedRichiesta.prognosiOncologica && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prognosi oncologica</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.prognosiOncologica}</p>
                    </div>
                  )}
                  {selectedRichiesta.finalitaTerapia && selectedRichiesta.finalitaTerapia.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Finalità della terapia oncologica</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.finalitaTerapia.join(', ')}</p>
                    </div>
                  )}
                  {selectedRichiesta.tossicitaEmatologica !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">% Tossicità ematologica G3/G4</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.tossicitaEmatologica}%</p>
                    </div>
                  )}
                  {selectedRichiesta.tossicitaExtraEmatologica !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">% Tossicità extra-ematologica G3/G4</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.tossicitaExtraEmatologica}%</p>
                    </div>
                  )}
                  {selectedRichiesta.quesitiGeriatra && selectedRichiesta.quesitiGeriatra.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesiti per geriatra</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.quesitiGeriatra.join(', ')}</p>
                    </div>
                  )}
                  {selectedRichiesta.quesitiGeriatraAltro && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesiti per geriatra (Altro)</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.quesitiGeriatraAltro}</p>
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
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-iov-gray-text mb-6">Elenco Richieste Prenotazione</h2>

        {/* Barre di ricerca e filtri */}
        <div className="mb-6 space-y-4">
          {/* Barra di ricerca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, cognome, codice fiscale, ambulatorio, patologia, quesito..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
          </div>
          
          {/* Filtri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro per data */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Data Richiesta
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
                <option value="in-attesa">In attesa</option>
                <option value="prenotato">Prenotato</option>
                <option value="rifiutato">Rifiutato</option>
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

        {richieste.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nessuna richiesta presente
          </div>
        ) : richiesteFiltrate.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {(filtroData || filtroAmbulatorio || filtroPatologia || filtroStato || searchTerm)
              ? 'Nessuna richiesta trovata con i filtri selezionati' 
              : 'Nessuna richiesta presente'}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-iov-light-blue-light border-b-2 border-iov-light-blue">
                    <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Paziente</th>
                    <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">CF</th>
                    <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Patologia</th>
                    <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Ambulatorio</th>
                    <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Score</th>
                    <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Stato</th>
                    <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Data Richiesta</th>
                    <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Azioni</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {richiesteFiltrate.map((richiesta, index) => (
                    <tr 
                      key={richiesta.id} 
                      className={`transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-iov-light-blue-light hover:shadow-sm`}
                    >
                      <td className="py-4 px-4 text-base font-medium text-iov-gray-text whitespace-normal">
                        {richiesta.nome} {richiesta.cognome}
                      </td>
                      <td className="py-4 px-4 text-base text-iov-gray-text font-mono whitespace-normal">{richiesta.codiceFiscale}</td>
                      <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">
                        <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-sm whitespace-normal">
                          {richiesta.patologia}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">
                        <span className="inline-flex items-center px-3 py-1 rounded-md bg-purple-50 text-purple-700 font-medium text-sm whitespace-normal">
                          {richiesta.ambulatorio}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {richiesta.score !== undefined ? (
                          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-iov-dark-blue text-white font-bold text-base">
                            {richiesta.score}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-base">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm whitespace-normal ${getStatoColor(richiesta.stato)}`}>
                          {getStatoLabel(richiesta.stato)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{richiesta.dataRichiesta}</span>
                          <span className="text-sm text-gray-500">alle {richiesta.orarioRichiesta}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedRichiesta(richiesta)}
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

export default ElencoRichieste;

