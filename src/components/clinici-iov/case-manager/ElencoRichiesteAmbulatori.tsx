import { useState } from 'react';
import { ArrowLeft, Eye, FileText, Search, Filter, Download, ExternalLink, User, Calendar, Stethoscope, FileCheck, Clock, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { RichiestaAmbulatorio, Ambulatorio, SlotPrenotazione, VisitaStorico, PDTA } from './types';

interface ElencoRichiesteAmbulatoriProps {
  onBack: () => void;
}

// Mock data
const mockRichieste: RichiestaAmbulatorio[] = [
  {
    id: '1',
    codiceFiscale: 'RSSMRA80A01H501U',
    nome: 'Mario',
    cognome: 'Rossi',
    dataNascita: '01-01-1980',
    residenza: 'Padova, Via Roma 1',
    telefono: '+39 333 1234567',
    mail: 'mario.rossi@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Polmone',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 5,
    slot: {
      data: '15-02-2024',
      ora: '10:00',
      ambulatorio: 'Cure Simultanee',
      medico: 'Dr. Maria Verdi',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_rossi_mario_20240115.pdf',
    dataRichiesta: '15-01-2024',
    orarioRichiesta: '14:30',
    quesito: 'Valutazione per terapia combinata chemio-radioterapia. Paziente con neoplasia polmonare localmente avanzata.',
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
    residenza: 'Venezia, Via Garibaldi 5',
    telefono: '+39 333 2345678',
    mail: 'giovanna.bianchi@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Mammella',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 8,
    livelloUrgenza: '6-9',
    tempoRimanente: '5 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_bianchi_giovanna_20240120.pdf',
    dataRichiesta: '20-01-2024',
    orarioRichiesta: '09:15',
    quesito: 'Valutazione metastasi ossee multiple. Paziente con carcinoma mammario metastatico.',
    uoRiferimento: 'UOC Oncologia 1',
    sopravvivenzaStimata: '6-12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee.',
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
    residenza: 'Vicenza, Via Manzoni 10',
    telefono: '+39 333 3456789',
    mail: 'luca.verdi@email.it',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Colon',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    slot: {
      data: '10-02-2024',
      ora: '14:30',
      ambulatorio: 'Oncogeriatria',
      medico: 'Dr. Anna Rossi',
    },
    tempoRimanente: 'fuori tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_verdi_luca_20240118.pdf',
    dataRichiesta: '18-01-2024',
    orarioRichiesta: '11:45',
    quesito: 'Valutazione oncogeriatrica per paziente anziano con neoplasia del colon.',
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
    quesitiGeriatra: ['Attuabilità programma proposto', 'Necessità di presa in carico durante la terapia: Geriatrica'],
    programmaAttuabile: true,
    presaInCaricoGeriatrica: true,
    presaInCaricoGeriatricaTempistica: 'Durante tutto il ciclo di trattamento',
  },
  {
    id: '4',
    codiceFiscale: 'NRIFRN85D10H501T',
    nome: 'Francesca',
    cognome: 'Neri',
    dataNascita: '10-04-1985',
    residenza: 'Verona, Via Mazzini 3',
    telefono: '+39 333 4567890',
    mail: 'francesca.neri@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Prostata',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 3,
    tempoRimanente: '2 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_neri_francesca_20240122.pdf',
    dataRichiesta: '22-01-2024',
    orarioRichiesta: '16:20',
    quesito: 'Valutazione per trattamento combinato chemio-radioterapia in paziente con carcinoma prostatico localmente avanzato.',
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
    residenza: 'Treviso, Via Dante 7',
    telefono: '+39 333 5678901',
    mail: 'marco.blu@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Polmone',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 7,
    slot: {
      data: '20-02-2024',
      ora: '09:30',
      ambulatorio: 'Cure Simultanee',
      medico: 'Dr. Maria Verdi',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_blu_marco_20240125.pdf',
    dataRichiesta: '25-01-2024',
    orarioRichiesta: '08:00',
    quesito: 'Valutazione per terapia combinata in paziente con neoplasia polmonare avanzata. Necessità di valutazione multidisciplinare.',
    psKarnofsky: '50-60',
    sopravvivenzaStimataScore: '6-12 mesi',
    sintomi: ['Dispnea', 'Iporessia', 'Calo Ponderale'],
    trattamentiImpatto: 'No',
    tossicitaAttesa: 'Ematologica',
    problemiSocioAssistenziali: 'Inadeguato supporto',
  },
  {
    id: '6',
    codiceFiscale: 'GRNPLA88F15F205W',
    nome: 'Paola',
    cognome: 'Gialli',
    dataNascita: '15-06-1988',
    residenza: 'Padova, Via Verdi 12',
    telefono: '+39 333 6789012',
    mail: 'paola.gialli@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Mammella',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 4,
    tempoRimanente: '1 giorno',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_gialli_paola_20240126.pdf',
    dataRichiesta: '26-01-2024',
    orarioRichiesta: '10:15',
    quesito: 'Valutazione per trattamento combinato chemio-radioterapia in paziente con carcinoma mammario localmente avanzato.',
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Dolore', 'Ansia Depressione'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Mucosite',
    problemiSocioAssistenziali: 'Limitazioni assistenziali',
  },
  {
    id: '7',
    codiceFiscale: 'MRNGLN82G20H501K',
    nome: 'Giuliano',
    cognome: 'Marrone',
    dataNascita: '20-07-1982',
    residenza: 'Venezia, Via San Marco 25',
    telefono: '+39 333 7890123',
    mail: 'giuliano.marrone@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Retto',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 6,
    slot: {
      data: '18-02-2024',
      ora: '11:00',
      ambulatorio: 'Cure Simultanee',
      medico: 'Dr. Maria Verdi',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_marrone_giuliano_20240127.pdf',
    dataRichiesta: '27-01-2024',
    orarioRichiesta: '15:45',
    quesito: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma del retto localmente avanzato.',
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Dolore'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Ematologica',
    problemiSocioAssistenziali: 'Nessuno',
  },
  {
    id: '8',
    codiceFiscale: 'RSSLCA65H10L219M',
    nome: 'Lucia',
    cognome: 'Rosa',
    dataNascita: '10-08-1965',
    residenza: 'Vicenza, Via Palladio 8',
    telefono: '+39 333 8901234',
    mail: 'lucia.rosa@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Prostata',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 10,
    livelloUrgenza: '≥ 10',
    slot: {
      data: '05-02-2024',
      ora: '08:30',
      ambulatorio: 'Osteoncologia',
      medico: 'Dr. Paolo Neri',
      tipo: 'visita',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_rosa_lucia_20240128.pdf',
    dataRichiesta: '28-01-2024',
    orarioRichiesta: '09:00',
    quesito: 'Valutazione urgente per metastasi ossee multiple. Paziente con carcinoma prostatico metastatico e sintomi neurologici.',
    uoRiferimento: 'UOC Oncologia 2',
    sopravvivenzaStimata: '≥12 mesi',
    quesitoTeam: 'Valutazione urgente per metastasi ossee multiple con sintomi neurologici.',
    richiestaPer: ['visita'],
    psKarnofsky: '≤ 70',
    segniSintomi: 'Sintomi da compressione',
    metastasiViscerali: 'Multiple lesioni viscerali',
    nMetastasiVertebrali: '≥ 3',
    sedeMalattiaPrimitiva: 'Prostata',
  },
  {
    id: '9',
    codiceFiscale: 'VRDPLA72I25F205N',
    nome: 'Paolo',
    cognome: 'Verdi',
    dataNascita: '25-09-1972',
    residenza: 'Verona, Via Scaligera 15',
    telefono: '+39 333 9012345',
    mail: 'paolo.verdi@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Polmone',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 6,
    livelloUrgenza: '6-9',
    tempoRimanente: '3 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_verdi_paolo_20240129.pdf',
    dataRichiesta: '29-01-2024',
    orarioRichiesta: '11:30',
    quesito: 'Valutazione metastasi ossee in paziente con carcinoma polmonare metastatico. Necessità di valutazione per trattamento delle lesioni ossee.',
    uoRiferimento: 'Radioterapia',
    sopravvivenzaStimata: '6-12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee e gestione del dolore.',
    richiestaPer: ['visita', 'discussione'],
    psKarnofsky: '80',
    segniSintomi: 'Dolore scheletrico',
    metastasiViscerali: 'Oligometastasi viscerali',
    nMetastasiVertebrali: '2',
    sedeMalattiaPrimitiva: 'Vie biliari, fegato, polmone, stomaco, esofago, CUP',
  },
  {
    id: '10',
    codiceFiscale: 'BNCGRN68L15H501P',
    nome: 'Giorgio',
    cognome: 'Bianchi',
    dataNascita: '15-10-1968',
    residenza: 'Padova, Via Marconi 20',
    telefono: '+39 333 0123456',
    mail: 'giorgio.bianchi@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Mammella',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 4,
    livelloUrgenza: '1-5',
    slot: {
      data: '25-02-2024',
      ora: '15:00',
      ambulatorio: 'Osteoncologia',
      medico: 'Dr. Paolo Neri',
      tipo: 'visita',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_bianchi_giorgio_20240130.pdf',
    dataRichiesta: '30-01-2024',
    orarioRichiesta: '14:00',
    quesito: 'Valutazione metastasi ossee in paziente con carcinoma mammario metastatico.',
    uoRiferimento: 'UOC Oncologia 1',
    sopravvivenzaStimata: '≥12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee.',
    richiestaPer: ['visita'],
    psKarnofsky: '100-90',
    segniSintomi: 'Nessuno',
    metastasiViscerali: 'Nessuna viscerale',
    nMetastasiVertebrali: '0-1',
    sedeMalattiaPrimitiva: 'Mammella',
  },
  {
    id: '11',
    codiceFiscale: 'NRIMRC75M05L219Q',
    nome: 'Marco',
    cognome: 'Neri',
    dataNascita: '05-11-1975',
    residenza: 'Venezia, Via Rialto 30',
    telefono: '+39 333 1234567',
    mail: 'marco.neri@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Colon',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 9,
    livelloUrgenza: '6-9',
    tempoRimanente: '4 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_neri_marco_20240131.pdf',
    dataRichiesta: '31-01-2024',
    orarioRichiesta: '16:00',
    quesito: 'Valutazione metastasi ossee multiple in paziente con carcinoma del colon metastatico.',
    uoRiferimento: 'UOC Oncologia 3',
    sopravvivenzaStimata: '6-12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee e gestione del dolore.',
    richiestaPer: ['visita'],
    psKarnofsky: '80',
    segniSintomi: 'Dolore scheletrico',
    metastasiViscerali: 'Oligometastasi viscerali',
    nMetastasiVertebrali: '2',
    sedeMalattiaPrimitiva: 'Colon',
  },
  {
    id: '12',
    codiceFiscale: 'VRDANNA55N20F205R',
    nome: 'Anna',
    cognome: 'Verdi',
    dataNascita: '20-12-1955',
    residenza: 'Vicenza, Via Monte Berico 5',
    telefono: '+39 333 2345678',
    mail: 'anna.verdi@email.it',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Mammella',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    slot: {
      data: '12-02-2024',
      ora: '10:00',
      ambulatorio: 'Oncogeriatria',
      medico: 'Dr. Anna Rossi',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_verdi_anna_20240201.pdf',
    dataRichiesta: '01-02-2024',
    orarioRichiesta: '09:30',
    quesito: 'Valutazione oncogeriatrica per paziente fragile con neoplasia mammaria. Necessità di adattamento terapeutico.',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 2,
    punteggioG8: 10,
    esitoVGM: 'fragile',
    propostaTerapeutica: 'terapia standard - dosi ridotte (eventualmente da aumentare)',
    prognosiOncologica: '<12 mesi',
    finalitaTerapia: ['Miglioramento sintomi / qualità di vita'],
    tossicitaEmatologica: 20,
    tossicitaExtraEmatologica: 15,
    quesitiGeriatra: [
      'Attuabilità programma proposto',
      'Necessità di presa in carico durante la terapia: Geriatrica',
      'Valutazione rischio cognitive impairment',
      'Revisione polifarmacoterapia',
    ],
    programmaAttuabile: false,
    presaInCaricoGeriatrica: true,
    presaInCaricoGeriatricaTempistica: 'Durante tutto il ciclo di trattamento, con controlli settimanali',
    revisionePolifarmacoterapia: true,
    revisionePolifarmacoterapiaDettaglio: 'riduzione numero totale di farmaci',
    rischioCognitiveImpairment: 'moderato',
  },
  {
    id: '13',
    codiceFiscale: 'BLUFRN60O10H501S',
    nome: 'Franco',
    cognome: 'Blu',
    dataNascita: '10-01-1960',
    residenza: 'Treviso, Via Calmaggiore 18',
    telefono: '+39 333 3456789',
    mail: 'franco.blu@email.it',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Polmone',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    tempoRimanente: '6 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_blu_franco_20240202.pdf',
    dataRichiesta: '02-02-2024',
    orarioRichiesta: '13:15',
    quesito: 'Valutazione oncogeriatrica per paziente anziano con neoplasia polmonare avanzata.',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 1,
    punteggioG8: 12,
    esitoVGM: 'vulnerabile',
    propostaTerapeutica: 'terapia standard - dosi ridotte (non previsto aumento dosi)',
    prognosiOncologica: '12-24 mesi',
    finalitaTerapia: ['Aumento OS / PFS', 'Miglioramento sintomi / qualità di vita'],
    tossicitaEmatologica: 25,
    tossicitaExtraEmatologica: 20,
    quesitiGeriatra: [
      'Attuabilità programma proposto',
      'Necessità di presa in carico durante la terapia: Di altro specialista',
      'Revisione polifarmacoterapia',
    ],
    programmaAttuabile: true,
    presaInCaricoAltroSpecialista: true,
    presaInCaricoAltroSpecialistaDettaglio: 'Pneumologo per gestione sintomi respiratori',
    revisionePolifarmacoterapia: true,
    revisionePolifarmacoterapiaDettaglio: 'farmaci modificati, stesso numero totale',
  },
  {
    id: '14',
    codiceFiscale: 'GRNMRN78P25L219T',
    nome: 'Marina',
    cognome: 'Gialli',
    dataNascita: '25-02-1978',
    residenza: 'Padova, Via Petrarca 22',
    telefono: '+39 333 4567890',
    mail: 'marina.gialli@email.it',
    ambulatorio: 'Oncogeriatria',
    patologia: 'Colon',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    slot: {
      data: '14-02-2024',
      ora: '11:30',
      ambulatorio: 'Oncogeriatria',
      medico: 'Dr. Anna Rossi',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_gialli_marina_20240203.pdf',
    dataRichiesta: '03-02-2024',
    orarioRichiesta: '10:00',
    quesito: 'Valutazione oncogeriatrica per paziente con neoplasia del colon localmente avanzata.',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 0,
    punteggioG8: 16,
    esitoVGM: 'fit',
    propostaTerapeutica: 'terapia standard - dosi standard',
    prognosiOncologica: '>24 mesi',
    finalitaTerapia: ['Aumento OS / PFS'],
    tossicitaEmatologica: 10,
    tossicitaExtraEmatologica: 8,
    quesitiGeriatra: ['Attuabilità programma proposto'],
    programmaAttuabile: true,
    attivazioneServiziDomiciliari: false,
  },
  {
    id: '15',
    codiceFiscale: 'MRNPLA73Q15F205U',
    nome: 'Paolo',
    cognome: 'Marrone',
    dataNascita: '15-03-1973',
    residenza: 'Verona, Via Nuova 40',
    telefono: '+39 333 5678901',
    mail: 'paolo.marrone@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Stomaco',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 5,
    tempoRimanente: '7 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_marrone_paolo_20240204.pdf',
    dataRichiesta: '04-02-2024',
    orarioRichiesta: '14:20',
    quesito: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma gastrico localmente avanzato.',
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Iporessia', 'Calo Ponderale'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Ematologica',
    problemiSocioAssistenziali: 'Nessuno',
  },
  {
    id: '16',
    codiceFiscale: 'RSSGNN80R20H501V',
    nome: 'Giovanni',
    cognome: 'Rosa',
    dataNascita: '20-04-1980',
    residenza: 'Venezia, Via Cannaregio 50',
    telefono: '+39 333 6789012',
    mail: 'giovanni.rosa@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Melanoma',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 2,
    slot: {
      data: '22-02-2024',
      ora: '09:00',
      ambulatorio: 'Cure Simultanee',
      medico: 'Dr. Maria Verdi',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_rosa_giovanni_20240205.pdf',
    dataRichiesta: '05-02-2024',
    orarioRichiesta: '11:00',
    quesito: 'Valutazione per trattamento combinato in paziente con melanoma avanzato.',
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: [],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Nessuna',
    problemiSocioAssistenziali: 'Nessuno',
  },
  {
    id: '17',
    codiceFiscale: 'VRDGLN77S25L219W',
    nome: 'Giuliano',
    cognome: 'Verdi',
    dataNascita: '25-05-1977',
    residenza: 'Vicenza, Via Verdi 15',
    telefono: '+39 333 7890123',
    mail: 'giuliano.verdi@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Polmone',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 7,
    livelloUrgenza: '6-9',
    tempoRimanente: '3 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_verdi_giuliano_20240206.pdf',
    dataRichiesta: '06-02-2024',
    orarioRichiesta: '10:30',
    quesito: 'Valutazione metastasi ossee in paziente con carcinoma polmonare metastatico. Necessità di discussione multidisciplinare.',
    uoRiferimento: 'UOC Oncologia 1',
    sopravvivenzaStimata: '6-12 mesi',
    quesitoTeam: 'Discussione multidisciplinare per valutazione trattamento delle metastasi ossee.',
    richiestaPer: ['discussione'],
    psKarnofsky: '80',
    segniSintomi: 'Dolore scheletrico',
    metastasiViscerali: 'Oligometastasi viscerali',
    nMetastasiVertebrali: '2',
    sedeMalattiaPrimitiva: 'Polmone',
  },
  {
    id: '18',
    codiceFiscale: 'BLUFRN82T10H501X',
    nome: 'Franco',
    cognome: 'Blu',
    dataNascita: '10-06-1982',
    residenza: 'Treviso, Via Roma 25',
    telefono: '+39 333 8901234',
    mail: 'franco.blu@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Prostata',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 8,
    livelloUrgenza: '6-9',
    slot: {
      data: '28-02-2024',
      ambulatorio: 'Osteoncologia',
      medico: 'Dr. Paolo Neri',
      tipo: 'discussione',
    },
    tempoRimanente: 'in tempo',
    statoSlot: 'prenotato',
    impegnativaFile: 'impegnativa_blu_franco_20240207.pdf',
    dataRichiesta: '07-02-2024',
    orarioRichiesta: '11:15',
    quesito: 'Discussione multidisciplinare per metastasi ossee multiple in paziente con carcinoma prostatico metastatico.',
    uoRiferimento: 'UOC Oncologia 2',
    sopravvivenzaStimata: '≥12 mesi',
    quesitoTeam: 'Discussione multidisciplinare per valutazione trattamento delle metastasi ossee multiple.',
    richiestaPer: ['discussione'],
    psKarnofsky: '≤ 70',
    segniSintomi: 'Sintomi da compressione',
    metastasiViscerali: 'Multiple lesioni viscerali',
    nMetastasiVertebrali: '≥ 3',
    sedeMalattiaPrimitiva: 'Prostata',
  },
  {
    id: '19',
    codiceFiscale: 'GRNPLA69U20F205Y',
    nome: 'Paola',
    cognome: 'Gialli',
    dataNascita: '20-07-1969',
    residenza: 'Padova, Via Dante 30',
    telefono: '+39 333 9012345',
    mail: 'paola.gialli@email.it',
    ambulatorio: 'Osteoncologia',
    patologia: 'Mammella',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 5,
    livelloUrgenza: '1-5',
    tempoRimanente: '5 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_gialli_paola_20240208.pdf',
    dataRichiesta: '08-02-2024',
    orarioRichiesta: '14:45',
    quesito: 'Valutazione metastasi ossee. Possibilità di visita o discussione multidisciplinare.',
    uoRiferimento: 'UOC Oncologia 1',
    sopravvivenzaStimata: '≥12 mesi',
    quesitoTeam: 'Valutazione trattamento delle metastasi ossee.',
    richiestaPer: ['visita', 'discussione'],
    psKarnofsky: '100-90',
    segniSintomi: 'Nessuno',
    metastasiViscerali: 'Nessuna viscerale',
    nMetastasiVertebrali: '0-1',
    sedeMalattiaPrimitiva: 'Mammella',
  },
  {
    id: '20',
    codiceFiscale: 'MRNGRN71V15L219Z',
    nome: 'Giorgio',
    cognome: 'Marrone',
    dataNascita: '15-08-1971',
    residenza: 'Venezia, Via San Marco 40',
    telefono: '+39 333 0123456',
    mail: 'giorgio.marrone@email.it',
    ambulatorio: 'Cure Simultanee',
    patologia: 'Retto',
    medicoRichiedente: 'Dr. Carlo Bianchi',
    score: 4,
    tempoRimanente: '6 giorni',
    statoSlot: 'da-prenotare',
    impegnativaFile: 'impegnativa_marrone_giorgio_20240209.pdf',
    dataRichiesta: '09-02-2024',
    orarioRichiesta: '09:20',
    quesito: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma del retto localmente avanzato.',
    psKarnofsky: '>70',
    sopravvivenzaStimataScore: '≥ 12 mesi',
    sintomi: ['Dolore'],
    trattamentiImpatto: 'si',
    tossicitaAttesa: 'Ematologica',
    problemiSocioAssistenziali: 'Nessuno',
  },
];

const mockStoricoVisite: VisitaStorico[] = [
  {
    id: 'v1',
    dataVisita: '10-01-2024',
    oraVisita: '10:00',
    ambulatorio: 'Cure Simultanee',
    medico: 'Dr. Maria Verdi',
    richiestaId: '1',
  },
  {
    id: 'v2',
    dataVisita: '15-12-2023',
    oraVisita: '14:30',
    ambulatorio: 'Oncogeriatria',
    medico: 'Dr. Anna Rossi',
    richiestaId: '3',
  },
  {
    id: 'v3',
    dataVisita: '05-01-2024',
    oraVisita: '15:00',
    ambulatorio: 'Cure Simultanee',
    medico: 'Dr. Maria Verdi',
    richiestaId: '5',
  },
  {
    id: 'v4',
    dataVisita: '20-11-2023',
    oraVisita: '10:30',
    ambulatorio: 'Osteoncologia',
    medico: 'Dr. Paolo Neri',
    richiestaId: '8',
  },
  {
    id: 'v5',
    dataVisita: '10-10-2023',
    oraVisita: '14:00',
    ambulatorio: 'Oncogeriatria',
    medico: 'Dr. Anna Rossi',
    richiestaId: '12',
  },
];

function ElencoRichiesteAmbulatori({ onBack }: ElencoRichiesteAmbulatoriProps) {
  const [richieste] = useState<RichiestaAmbulatorio[]>(mockRichieste);
  const [storicoVisite] = useState<VisitaStorico[]>(mockStoricoVisite);
  const [selectedRichiesta, setSelectedRichiesta] = useState<RichiestaAmbulatorio | null>(null);
  const [selectedVisitaStorico, setSelectedVisitaStorico] = useState<VisitaStorico | null>(null);
  const [ambulatorioAttivo, setAmbulatorioAttivo] = useState<Ambulatorio>('Cure Simultanee');
  const [filtroStato, setFiltroStato] = useState<string>('');
  const [filtroPatologia, setFiltroPatologia] = useState<string>('');
  const [filtroMedico, setFiltroMedico] = useState<string>('');
  const [filtroScoreMin, setFiltroScoreMin] = useState<string>('');
  const [filtroScoreMax, setFiltroScoreMax] = useState<string>('');
  const [filtroDataRichiesta, setFiltroDataRichiesta] = useState<string>('');
  const [filtroTempoRimanente, setFiltroTempoRimanente] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSlot, setEditingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<SlotPrenotazione>({ data: '', ora: '', ambulatorio: '' });

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

  const richiesteFiltrate = richieste.filter(richiesta => {
    const matchAmbulatorio = richiesta.ambulatorio === ambulatorioAttivo;
    const matchStato = !filtroStato || richiesta.statoSlot === filtroStato;
    const matchPatologia = !filtroPatologia || richiesta.patologia === filtroPatologia;
    const matchMedico = !filtroMedico || richiesta.medicoRichiedente.toLowerCase().includes(filtroMedico.toLowerCase());
    const matchScoreMin = !filtroScoreMin || ambulatorioAttivo === 'Oncogeriatria' || (richiesta.score !== undefined && richiesta.score >= parseInt(filtroScoreMin));
    const matchScoreMax = !filtroScoreMax || ambulatorioAttivo === 'Oncogeriatria' || (richiesta.score !== undefined && richiesta.score <= parseInt(filtroScoreMax));
    const matchDataRichiesta = !filtroDataRichiesta || richiesta.dataRichiesta === filtroDataRichiesta;
    const matchTempoRimanente = !filtroTempoRimanente || richiesta.tempoRimanente === filtroTempoRimanente;
    const matchSearch = !searchTerm || 
      richiesta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      richiesta.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      richiesta.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      richiesta.patologia.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAmbulatorio && matchStato && matchPatologia && matchMedico && matchScoreMin && matchScoreMax && matchDataRichiesta && matchTempoRimanente && matchSearch;
  });

  const getStatoColor = (stato: 'da-prenotare' | 'prenotato') => {
    if (stato === 'prenotato') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatoLabel = (stato: 'da-prenotare' | 'prenotato') => {
    return stato === 'prenotato' ? 'Prenotato' : 'Da Prenotare';
  };

  const getTempoRimanenteColor = (tempo?: string) => {
    if (!tempo) return 'text-gray-600';
    if (tempo === 'in tempo') return 'text-green-600';
    if (tempo === 'fuori tempo') return 'text-red-600';
    return 'text-yellow-600';
  };

  const handleViewPDF = (filename: string) => {
    alert(`Demo: Apertura PDF ${filename}`);
  };

  const handleInserisciSlot = () => {
    if (!newSlot.data) {
      alert('Inserisci la data dello slot');
      return;
    }
    // Per Osteoncologia, se è una discussione, l'ora non è obbligatoria
    const isOsteoncologia = selectedRichiesta?.ambulatorio === 'Osteoncologia';
    const isDiscussione = selectedRichiesta?.richiestaPer?.includes('discussione');
    
    if (!isOsteoncologia || !isDiscussione) {
      // Per visite o altri ambulatori, l'ora è obbligatoria
      if (!newSlot.ora) {
        alert('Inserisci data e ora dello slot');
        return;
      }
    }
    
    if (selectedRichiesta) {
      const slotCompleto = {
        ...newSlot,
        tipo: isOsteoncologia && isDiscussione ? 'discussione' as const : 'visita' as const,
      };
      const updated = { ...selectedRichiesta, slot: slotCompleto, statoSlot: 'prenotato' as const, tempoRimanente: 'in tempo' };
      setSelectedRichiesta(updated);
      setEditingSlot(false);
      alert('Slot prenotato con successo!');
    }
  };

  const handleModificaSlot = () => {
    setEditingSlot(true);
    if (selectedRichiesta?.slot) {
      setNewSlot(selectedRichiesta.slot);
    }
  };

  const handleCancellaSlot = () => {
    if (selectedRichiesta && confirm('Sei sicuro di voler cancellare lo slot?')) {
      const updated = { ...selectedRichiesta, slot: undefined, statoSlot: 'da-prenotare' as const, tempoRimanente: '5 giorni' };
      setSelectedRichiesta(updated);
      alert('Slot cancellato');
    }
  };

  const renderScoreDetails = (richiesta: RichiestaAmbulatorio) => {
    if (richiesta.ambulatorio === 'Oncogeriatria') {
      return null;
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

  // Vista dettagli visita storico
  if (selectedVisitaStorico) {
    const richiestaCorrelata = richieste.find(r => r.id === selectedVisitaStorico.richiestaId);
    if (!richiestaCorrelata) return null;

    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedVisitaStorico(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna ai dettagli richiesta
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8 pb-6 border-b-2 border-iov-light-blue">
            <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Dettagli Visita Storico</h2>
            <p className="text-gray-500 text-sm">Visita del {selectedVisitaStorico.dataVisita} alle {selectedVisitaStorico.oraVisita}</p>
          </div>

          <div className="space-y-8">
            {/* Dati Visita */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <h3 className="text-xl font-bold text-iov-gray-text mb-4">Informazioni Visita</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Visita</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.dataVisita}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ora Visita</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.oraVisita}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ambulatorio</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.ambulatorio}</p>
                </div>
                {selectedVisitaStorico.medico && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medico</label>
                    <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.medico}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dettagli Richiesta Originale - riutilizziamo la stessa struttura */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-100 shadow-sm">
              <h3 className="text-xl font-bold text-iov-gray-text mb-4">Dettagli Richiesta Originale</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ambulatorio</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiestaCorrelata.ambulatorio}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Patologia/PDTA</label>
                  <p className="text-base font-semibold text-iov-gray-text">{richiestaCorrelata.patologia}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesito Diagnostico</label>
                  <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">{richiestaCorrelata.quesito}</p>
                </div>
              </div>
            </div>

            {renderScoreDetails(richiestaCorrelata)}
          </div>
        </div>
      </div>
    );
  }

  // Vista dettagli richiesta
  if (selectedRichiesta) {
    const visiteStoricoRichiesta = storicoVisite.filter(v => v.richiestaId === selectedRichiesta.id);

    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => {
            setSelectedRichiesta(null);
            setEditingSlot(false);
          }}
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
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold shadow-sm border-2 ${getStatoColor(selectedRichiesta.statoSlot)}`}>
              {getStatoLabel(selectedRichiesta.statoSlot)}
            </span>
          </div>

          <div className="space-y-8">
            {/* Dati Personali */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dati Personali</h3>
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
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Residenza
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.residenza}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefono
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.telefono}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.mail}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data di Nascita</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.dataNascita}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PDTA di Riferimento</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedRichiesta.patologia}</p>
                </div>
              </div>
            </div>

            {/* Stato Prenotazione */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-iov-dark-blue flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-iov-gray-text">Stato Prenotazione</h3>
              </div>

              {selectedRichiesta.statoSlot === 'da-prenotare' && !editingSlot && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <p className="text-yellow-800 font-semibold mb-4">Slot non ancora prenotato</p>
                  <button
                    onClick={() => {
                      setEditingSlot(true);
                      setNewSlot({ data: '', ora: '', ambulatorio: selectedRichiesta.ambulatorio });
                    }}
                    className="bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Inserisci Slot
                  </button>
                </div>
              )}

              {editingSlot && (
                <div className="bg-white border-2 border-iov-light-blue rounded-lg p-6">
                  <h4 className="font-bold text-iov-gray-text mb-4">
                    {selectedRichiesta.statoSlot === 'prenotato' ? 'Modifica Slot' : 'Inserisci Slot'}
                  </h4>
                  {selectedRichiesta.ambulatorio === 'Osteoncologia' && selectedRichiesta.richiestaPer?.includes('discussione') && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Nota:</strong> Questa è una discussione. L'orario non è obbligatorio.
                      </p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-iov-gray-text mb-2">Data</label>
                      <input
                        type="date"
                        value={newSlot.data}
                        onChange={(e) => setNewSlot({ ...newSlot, data: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                        Ora {selectedRichiesta.ambulatorio === 'Osteoncologia' && selectedRichiesta.richiestaPer?.includes('discussione') ? '(opzionale)' : ''}
                      </label>
                      <input
                        type="time"
                        value={newSlot.ora || ''}
                        onChange={(e) => setNewSlot({ ...newSlot, ora: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleInserisciSlot}
                      className="bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {selectedRichiesta.statoSlot === 'prenotato' ? 'Salva Modifiche' : 'Conferma Slot'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingSlot(false);
                        if (selectedRichiesta.slot) {
                          setNewSlot(selectedRichiesta.slot);
                        }
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}

              {selectedRichiesta.statoSlot === 'prenotato' && selectedRichiesta.slot && !editingSlot && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-green-800 font-semibold">Slot Prenotato</p>
                        {selectedRichiesta.slot.tipo === 'discussione' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-yellow-100 text-yellow-800 font-semibold text-sm border-2 border-yellow-300">
                            Discussione
                          </span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Data</label>
                          <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.slot.data}</p>
                        </div>
                        {selectedRichiesta.slot.ora && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Ora</label>
                            <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.slot.ora}</p>
                          </div>
                        )}
                        {selectedRichiesta.slot.medico && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Medico</label>
                            <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.slot.medico}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Tempo Rimanente</label>
                          <p className={`text-base font-semibold ${getTempoRimanenteColor(selectedRichiesta.tempoRimanente)}`}>
                            {selectedRichiesta.tempoRimanente}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleModificaSlot}
                      className="flex items-center gap-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modifica Slot</span>
                    </button>
                    <button
                      onClick={handleCancellaSlot}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancella Slot</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dettagli Richiesta - riutilizziamo la struttura dell'oncologo */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-100 shadow-sm">
              <h3 className="text-xl font-bold text-iov-gray-text mb-4">Dettagli Richiesta</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ambulatorio</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.ambulatorio}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Patologia/PDTA</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.patologia}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medico Richiedente</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.medicoRichiedente}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Richiesta</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedRichiesta.dataRichiesta} alle {selectedRichiesta.orarioRichiesta}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesito Diagnostico</label>
                  <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">{selectedRichiesta.quesito}</p>
                </div>
              </div>
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

            {/* Campi condizionali e score - riutilizziamo la funzione renderScoreDetails */}
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
                </div>
              </div>
            )}

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
                </div>
              </div>
            )}

            {renderScoreDetails(selectedRichiesta)}

            {/* Storico Visite */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-iov-dark-blue flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-iov-gray-text">Storico Visite</h3>
              </div>

              {visiteStoricoRichiesta.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nessuna visita presente nello storico</p>
              ) : (
                <div className="space-y-3">
                  {visiteStoricoRichiesta.map((visita) => (
                    <div
                      key={visita.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-iov-dark-blue transition-colors cursor-pointer"
                      onClick={() => setSelectedVisitaStorico(visita)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-iov-gray-text">{visita.dataVisita} alle {visita.oraVisita}</p>
                          <p className="text-sm text-gray-600">{visita.ambulatorio}</p>
                          {visita.medico && <p className="text-sm text-gray-600">{visita.medico}</p>}
                        </div>
                        <button className="text-iov-dark-blue hover:text-iov-dark-blue-hover">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista elenco
  const richiestePerAmbulatorio = tuttiAmbulatori.map(amb => ({
    ambulatorio: amb,
    richieste: richieste.filter(r => r.ambulatorio === amb),
    count: richieste.filter(r => r.ambulatorio === amb).length,
  }));

  const richiesteTabAttivo = richiesteFiltrate;

  return (
    <div className="max-w-[95%] mx-auto">
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
            <FileText className="w-8 h-8 text-iov-dark-blue" />
            Elenco Richieste Ambulatori Multidisciplinari
          </h2>
        </div>

        {/* Tab per ambulatori */}
        <div className="mb-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {richiestePerAmbulatorio.map(({ ambulatorio, count }) => (
              <button
                key={ambulatorio}
                onClick={() => setAmbulatorioAttivo(ambulatorio)}
                className={`px-6 py-3 font-semibold text-base border-b-2 transition-colors whitespace-nowrap ${
                  ambulatorioAttivo === ambulatorio
                    ? 'border-iov-dark-blue text-iov-dark-blue bg-iov-light-blue-light'
                    : 'border-transparent text-iov-gray-text hover:text-iov-dark-blue hover:border-gray-300'
                }`}
              >
                {ambulatorio} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Barre di ricerca e filtri */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, cognome, codice fiscale, patologia..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Stato Slot
              </label>
              <select
                value={filtroStato}
                onChange={(e) => setFiltroStato(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              >
                <option value="">Tutti</option>
                <option value="da-prenotare">Da Prenotare</option>
                <option value="prenotato">Prenotato</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1">Patologia/PDTA</label>
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

            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1">Medico Richiedente</label>
              <input
                type="text"
                value={filtroMedico}
                onChange={(e) => setFiltroMedico(e.target.value)}
                placeholder="Cerca medico..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-iov-gray-text mb-1">Data Richiesta</label>
              <input
                type="date"
                value={filtroDataRichiesta}
                onChange={(e) => setFiltroDataRichiesta(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              />
            </div>
          </div>


          {(filtroStato || filtroPatologia || filtroMedico || filtroScoreMin || filtroScoreMax || filtroDataRichiesta || filtroTempoRimanente || searchTerm) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setFiltroStato('');
                  setFiltroPatologia('');
                  setFiltroMedico('');
                  setFiltroScoreMin('');
                  setFiltroScoreMax('');
                  setFiltroDataRichiesta('');
                  setFiltroTempoRimanente('');
                  setSearchTerm('');
                }}
                className="text-sm text-iov-gray-text hover:text-iov-dark-blue font-medium"
              >
                Rimuovi tutti i filtri
              </button>
            </div>
          )}
        </div>

        {richiesteTabAttivo.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {(filtroStato || filtroPatologia || filtroMedico || filtroScoreMin || filtroScoreMax || filtroDataRichiesta || filtroTempoRimanente || searchTerm)
              ? 'Nessuna richiesta trovata con i filtri selezionati'
              : 'Nessuna richiesta presente'}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-iov-light-blue-light border-b-2 border-iov-light-blue">
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Paziente</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">CF</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Patologia</th>
                  <th className="text-left py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Medico Richiedente</th>
                  {ambulatorioAttivo !== 'Oncogeriatria' && (
                    <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Score</th>
                  )}
                  {ambulatorioAttivo === 'Osteoncologia' && (
                    <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Tipo</th>
                  )}
                  <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Slot</th>
                  <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Tempo Rimanente</th>
                  <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Impegnativa</th>
                  <th className="text-center py-4 px-4 text-base font-bold text-iov-dark-blue uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {richiesteTabAttivo.map((richiesta, index) => (
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
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-sm">
                        {richiesta.patologia}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-base text-iov-gray-text whitespace-normal">{richiesta.medicoRichiedente}</td>
                    {ambulatorioAttivo !== 'Oncogeriatria' && (
                      <td className="py-4 px-4 text-center">
                        {richiesta.score !== undefined ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-iov-dark-blue text-white font-semibold text-sm">
                            {richiesta.score}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )}
                    {ambulatorioAttivo === 'Osteoncologia' && (
                      <td className="py-4 px-4 text-center">
                        {richiesta.richiestaPer?.includes('discussione') ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 font-semibold text-sm border-2 border-yellow-300">
                            Discussione
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-800 font-semibold text-sm border-2 border-blue-300">
                            Visita
                          </span>
                        )}
                      </td>
                    )}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm whitespace-normal border-2 ${getStatoColor(richiesta.statoSlot)}`}>
                        {getStatoLabel(richiesta.statoSlot)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {richiesta.tempoRimanente ? (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${getTempoRimanenteColor(richiesta.tempoRimanente)}`}>
                          <Clock className="w-4 h-4" />
                          {richiesta.tempoRimanente}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {richiesta.impegnativaFile ? (
                        <button
                          onClick={() => handleViewPDF(richiesta.impegnativaFile!)}
                          className="p-2 text-iov-dark-blue hover:bg-iov-light-blue-light rounded-lg transition-colors"
                          title="Visualizza Impegnativa PDF"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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

export default ElencoRichiesteAmbulatori;

