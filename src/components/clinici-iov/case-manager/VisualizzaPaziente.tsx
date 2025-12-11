import { useState } from 'react';
import { ArrowLeft, User, Search, Calendar, Stethoscope, Eye, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { DatiAnagrafici, CareGiver, MMG, RichiestaAmbulatorio, VisitaStorico, SlotPrenotazione, Ambulatorio, PDTA } from './types';

interface VisualizzaPazienteProps {
  onBack: () => void;
}

interface PazienteCompleto {
  datiAnagrafici: DatiAnagrafici;
  careGiver?: CareGiver;
  mmg: MMG; // Nome e cognome sempre presenti
  richiestaAttiva?: RichiestaAmbulatorio;
  storicoVisite: VisitaStorico[];
}

// Mock data per pazienti completi
const mockPazienti: Record<string, PazienteCompleto> = {
  'RSSMRA80A01H501U': {
    datiAnagrafici: {
      codiceFiscale: 'RSSMRA80A01H501U',
      nome: 'Mario',
      cognome: 'Rossi',
      dataNascita: '01-01-1980',
      residenza: 'Padova, Via Roma 1',
      telefono: '+39 333 1234567',
      mail: 'mario.rossi@email.it',
    },
    careGiver: {
      nome: 'Giulia',
      cognome: 'Rossi',
      mail: 'giulia.rossi@email.it',
      telefono: '+39 333 1234568',
    },
    mmg: {
      nome: 'Luigi',
      cognome: 'Bianchi',
      comuneRiferimento: 'Padova',
      mail: 'luigi.bianchi@mmg.it',
      telefono: '+39 049 1234567',
    },
    richiestaAttiva: {
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
    },
    storicoVisite: [
      {
        id: 'vs1',
        dataVisita: '20-01-2024',
        oraVisita: '10:00',
        ambulatorio: 'Cure Simultanee',
        medico: 'Dr. Maria Verdi',
        richiestaId: '1',
        richiesta: {
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
            data: '20-01-2024',
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
        },
      },
    ],
  },
  'BNCGNN75B15L219X': {
    datiAnagrafici: {
      codiceFiscale: 'BNCGNN75B15L219X',
      nome: 'Giovanna',
      cognome: 'Bianchi',
      dataNascita: '15-02-1975',
      residenza: 'Venezia, Via Garibaldi 5',
      telefono: '+39 333 2345678',
      mail: 'giovanna.bianchi@email.it',
    },
    // Nessun care giver per questo paziente
    mmg: {
      nome: 'Anna',
      cognome: 'Verdi',
      comuneRiferimento: 'Venezia',
      mail: 'anna.verdi@mmg.it',
      telefono: '+39 041 2345678',
    },
    richiestaAttiva: {
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
      richiestaPer: ['visita', 'discussione'],
    },
    storicoVisite: [],
  },
  'VRDLCA90C20F205Z': {
    datiAnagrafici: {
      codiceFiscale: 'VRDLCA90C20F205Z',
      nome: 'Luca',
      cognome: 'Verdi',
      dataNascita: '20-03-1990',
      residenza: 'Vicenza, Via Manzoni 10',
      telefono: '+39 333 3456789',
      mail: 'luca.verdi@email.it',
    },
    careGiver: {
      nome: 'Marco',
      cognome: 'Verdi',
      mail: 'marco.verdi@email.it',
      telefono: '+39 333 3456790',
    },
    mmg: {
      nome: 'Paolo',
      cognome: 'Neri',
      comuneRiferimento: 'Vicenza',
      mail: 'paolo.neri@mmg.it',
      telefono: '+39 0444 3456789',
    },
    storicoVisite: [
      {
        id: 'vs2',
        dataVisita: '10-02-2024',
        oraVisita: '14:30',
        ambulatorio: 'Oncogeriatria',
        medico: 'Dr. Anna Rossi',
        richiestaId: '3',
        richiesta: {
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
          quesitiGeriatra: ['Attuabilità programma proposto', 'Necessità di presa in carico durante la terapia: Geriatrica'],
        },
      },
      {
        id: 'vs3',
        dataVisita: '25-01-2024',
        oraVisita: '09:00',
        ambulatorio: 'Cure Simultanee',
        medico: 'Dr. Maria Verdi',
        richiestaId: '5',
        richiesta: {
          id: '5',
          codiceFiscale: 'VRDLCA90C20F205Z',
          nome: 'Luca',
          cognome: 'Verdi',
          dataNascita: '20-03-1990',
          residenza: 'Vicenza, Via Manzoni 10',
          telefono: '+39 333 3456789',
          mail: 'luca.verdi@email.it',
          ambulatorio: 'Cure Simultanee',
          patologia: 'Polmone',
          medicoRichiedente: 'Dr. Carlo Bianchi',
          score: 4,
          slot: {
            data: '25-01-2024',
            ora: '09:00',
            ambulatorio: 'Cure Simultanee',
            medico: 'Dr. Maria Verdi',
          },
          tempoRimanente: 'in tempo',
          statoSlot: 'prenotato',
          impegnativaFile: 'impegnativa_verdi_luca_20240122.pdf',
          dataRichiesta: '22-01-2024',
          orarioRichiesta: '16:00',
          quesito: 'Valutazione per terapia combinata in paziente con neoplasia polmonare avanzata. Necessità di valutazione multidisciplinare.',
        },
      },
    ],
  },
};

// Funzioni per generare dati mock dinamicamente
const generateMockAnagrafica = (codiceFiscale: string): DatiAnagrafici => {
  const nomi = ['Mario', 'Giovanna', 'Luigi', 'Anna', 'Paolo', 'Maria', 'Francesco', 'Elena', 'Roberto', 'Sofia'];
  const cognomi = ['Rossi', 'Bianchi', 'Verdi', 'Neri', 'Gialli', 'Blu', 'Ferrari', 'Romano', 'Colombo', 'Ricci'];
  const comuni = ['Padova', 'Venezia', 'Vicenza', 'Verona', 'Treviso', 'Rovigo', 'Belluno', 'Udine', 'Pordenone', 'Gorizia'];
  const index = Math.abs(codiceFiscale.charCodeAt(0)) % nomi.length;
  const index2 = Math.abs(codiceFiscale.charCodeAt(1)) % cognomi.length;
  const index3 = Math.abs(codiceFiscale.charCodeAt(2)) % comuni.length;
  
  return {
    codiceFiscale,
    nome: nomi[index],
    cognome: cognomi[index2],
    dataNascita: '01-01-1980',
    residenza: `${comuni[index3]}, Via ${nomi[index]} ${Math.floor(Math.random() * 100) + 1}`,
    telefono: `+39 3${Math.floor(Math.random() * 90000000) + 10000000}`,
    mail: `${nomi[index].toLowerCase()}.${cognomi[index2].toLowerCase()}@email.it`,
  };
};

const generateMockCareGiver = (codiceFiscale: string): CareGiver => {
  const nomi = ['Giuseppe', 'Giulia', 'Marco', 'Caterina', 'Stefano', 'Laura', 'Francesco', 'Elena'];
  const cognomi = ['Rossi', 'Bianchi', 'Verdi', 'Neri', 'Gialli', 'Blu', 'Ferrari', 'Romano'];
  const index = Math.abs(codiceFiscale.charCodeAt(4)) % nomi.length;
  const index2 = Math.abs(codiceFiscale.charCodeAt(5)) % cognomi.length;
  
  return {
    nome: nomi[index],
    cognome: cognomi[index2],
    mail: `${nomi[index].toLowerCase()}.${cognomi[index2].toLowerCase()}@email.it`,
    telefono: `+39 3${Math.floor(Math.abs(codiceFiscale.charCodeAt(4)) * 1000000) % 90000000 + 10000000}`,
  };
};

const generateMockMMG = (codiceFiscale: string): MMG => {
  const nomi = ['Luigi', 'Anna', 'Paolo', 'Maria', 'Marco', 'Francesca', 'Giuseppe', 'Elena'];
  const cognomi = ['Bianchi', 'Verdi', 'Neri', 'Rossi', 'Gialli', 'Blu', 'Ferrari', 'Romano'];
  const comuni = ['Padova', 'Venezia', 'Vicenza', 'Verona', 'Treviso', 'Rovigo', 'Belluno', 'Udine'];
  const index = Math.abs(codiceFiscale.charCodeAt(6)) % nomi.length;
  const index2 = Math.abs(codiceFiscale.charCodeAt(7)) % cognomi.length;
  const index3 = Math.abs(codiceFiscale.charCodeAt(8)) % comuni.length;
  
  return {
    nome: nomi[index],
    cognome: cognomi[index2],
    comuneRiferimento: comuni[index3],
    mail: `${nomi[index].toLowerCase()}.${cognomi[index2].toLowerCase()}@mmg.it`,
    telefono: `+39 0${Math.floor(Math.random() * 90000000) + 10000000}`,
  };
};

const generateMockRichiestaAttiva = (datiAnagrafici: DatiAnagrafici): RichiestaAmbulatorio => {
  const ambulatori: Ambulatorio[] = ['Cure Simultanee', 'Oncogeriatria', 'Osteoncologia'];
  const patologie: PDTA[] = ['Polmone', 'Mammella', 'Colon', 'Prostata', 'Retto', 'Stomaco'];
  const medici = ['Dr. Carlo Bianchi', 'Dr. Maria Verdi', 'Dr. Anna Rossi', 'Dr. Paolo Neri'];
  const ambulatorioIndex = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(10)) % ambulatori.length;
  const patologiaIndex = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(11)) % patologie.length;
  const medicoIndex = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(12)) % medici.length;
  
  const ambulatorio = ambulatori[ambulatorioIndex];
  const patologia = patologie[patologiaIndex];
  const statoSlot = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(13)) % 2 === 0 ? 'prenotato' : 'da-prenotare';
  
  const richiesta: RichiestaAmbulatorio = {
    id: `req-${datiAnagrafici.codiceFiscale.substring(0, 8)}`,
    codiceFiscale: datiAnagrafici.codiceFiscale,
    nome: datiAnagrafici.nome,
    cognome: datiAnagrafici.cognome,
    dataNascita: datiAnagrafici.dataNascita,
    residenza: datiAnagrafici.residenza,
    telefono: datiAnagrafici.telefono,
    mail: datiAnagrafici.mail,
    ambulatorio,
    patologia,
    medicoRichiedente: medici[medicoIndex],
    score: Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(14)) % 10 + 1,
    statoSlot: statoSlot as 'da-prenotare' | 'prenotato',
    impegnativaFile: `impegnativa_${datiAnagrafici.cognome.toLowerCase()}_${datiAnagrafici.nome.toLowerCase()}_20240115.pdf`,
    dataRichiesta: '15-01-2024',
    orarioRichiesta: '14:30',
    quesito: `Valutazione per ${ambulatorio === 'Osteoncologia' ? 'metastasi ossee' : ambulatorio === 'Oncogeriatria' ? 'valutazione oncogeriatrica' : 'terapia combinata'} in paziente con neoplasia ${patologia.toLowerCase()}.`,
  };
  
  if (statoSlot === 'prenotato') {
    const oggi = new Date();
    const dataVisita = new Date(oggi);
    dataVisita.setDate(oggi.getDate() + Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(15)) % 30);
    
    richiesta.slot = {
      data: dataVisita.toISOString().split('T')[0],
      ora: `${Math.floor(Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(14)) % 8) + 9}:00`,
      ambulatorio,
      medico: ambulatorio === 'Cure Simultanee' ? 'Dr. Maria Verdi' : ambulatorio === 'Oncogeriatria' ? 'Dr. Anna Rossi' : 'Dr. Paolo Neri',
    };
    richiesta.tempoRimanente = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(15)) % 3 === 0 ? 'in tempo' : 'fuori tempo';
  } else {
    richiesta.tempoRimanente = `${Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(15)) % 10 + 1} giorni`;
  }
  
  if (ambulatorio === 'Osteoncologia') {
    richiesta.richiestaPer = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(13)) % 2 === 0 ? ['visita'] : ['visita', 'discussione'];
  }
  
  // Aggiungi campi specifici per ambulatorio
  if (ambulatorio === 'Cure Simultanee') {
    richiesta.psKarnofsky = '>70';
    richiesta.sopravvivenzaStimataScore = '≥ 12 mesi';
    richiesta.sintomi = ['Dolore', 'Dispnea'];
    richiesta.trattamentiImpatto = 'si';
    richiesta.tossicitaAttesa = 'Ematologica';
    richiesta.problemiSocioAssistenziali = 'Nessuno';
  } else if (ambulatorio === 'Oncogeriatria') {
    richiesta.stadio = 'localmente avanzato';
    richiesta.finalitaTrattamento = 'curativo';
    richiesta.ecogPS = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(14)) % 3;
    richiesta.punteggioG8 = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(15)) % 5 + 11;
    richiesta.esitoVGM = ['fit', 'vulnerabile', 'fragile'][Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(12)) % 3];
    richiesta.quesitiGeriatra = ['Attuabilità programma proposto', 'Necessità di presa in carico durante la terapia: Geriatrica'];
  } else if (ambulatorio === 'Osteoncologia') {
    richiesta.uoRiferimento = 'UOC Oncologia 1';
    richiesta.sopravvivenzaStimata = '6-12 mesi';
    richiesta.quesitoTeam = 'Valutazione trattamento delle metastasi ossee.';
    richiesta.psKarnofsky = '80';
    richiesta.segniSintomi = 'Dolore scheletrico';
    richiesta.metastasiViscerali = 'Oligometastasi viscerali';
    richiesta.nMetastasiVertebrali = '2';
    richiesta.sedeMalattiaPrimitiva = patologia;
  }
  
  return richiesta;
};

const generateMockStoricoVisite = (datiAnagrafici: DatiAnagrafici): VisitaStorico[] => {
  const numVisite = Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(0)) % 3 + 2; // 2-4 visite (sempre almeno 2)
  const visite: VisitaStorico[] = [];
  
  for (let i = 0; i < numVisite; i++) {
    const ambulatori: Ambulatorio[] = ['Cure Simultanee', 'Oncogeriatria', 'Osteoncologia'];
    const ambulatorioIndex = Math.abs((datiAnagrafici.codiceFiscale.charCodeAt(i) + i) % ambulatori.length);
    const ambulatorio = ambulatori[ambulatorioIndex];
    
    const dataVisita = new Date();
    dataVisita.setDate(dataVisita.getDate() - (i + 1) * 30 - Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(i + 1)) % 15);
    
    const medici = ambulatorio === 'Cure Simultanee' ? 'Dr. Maria Verdi' : ambulatorio === 'Oncogeriatria' ? 'Dr. Anna Rossi' : 'Dr. Paolo Neri';
    
    const patologie: PDTA[] = ['Polmone', 'Mammella', 'Colon', 'Prostata', 'Retto'];
    const patologiaIndex = Math.abs((datiAnagrafici.codiceFiscale.charCodeAt(i + 2)) % patologie.length);
    
    visite.push({
      id: `vs-${datiAnagrafici.codiceFiscale.substring(0, 8)}-${i}`,
      dataVisita: dataVisita.toISOString().split('T')[0],
      oraVisita: `${Math.floor(Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(i + 3)) % 8) + 9}:00`,
      ambulatorio,
      medico: medici,
      richiestaId: `req-hist-${i}`,
      richiesta: {
        id: `req-hist-${i}`,
        codiceFiscale: datiAnagrafici.codiceFiscale,
        nome: datiAnagrafici.nome,
        cognome: datiAnagrafici.cognome,
        dataNascita: datiAnagrafici.dataNascita,
        residenza: datiAnagrafici.residenza,
        telefono: datiAnagrafici.telefono,
        mail: datiAnagrafici.mail,
        ambulatorio,
        patologia: patologie[patologiaIndex],
        medicoRichiedente: 'Dr. Carlo Bianchi',
        score: Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(i + 4)) % 10 + 1,
        statoSlot: 'prenotato',
        slot: {
          data: dataVisita.toISOString().split('T')[0],
          ora: `${Math.floor(Math.abs(datiAnagrafici.codiceFiscale.charCodeAt(i + 3)) % 8) + 9}:00`,
          ambulatorio,
          medico: medici,
        },
        tempoRimanente: 'in tempo',
        impegnativaFile: `impegnativa_${datiAnagrafici.cognome.toLowerCase()}_${datiAnagrafici.nome.toLowerCase()}_${dataVisita.toISOString().split('T')[0]}.pdf`,
        dataRichiesta: new Date(dataVisita.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        orarioRichiesta: '14:30',
        quesito: `Valutazione per ${ambulatorio === 'Osteoncologia' ? 'metastasi ossee' : ambulatorio === 'Oncogeriatria' ? 'valutazione oncogeriatrica' : 'terapia combinata'} in paziente con neoplasia ${patologie[patologiaIndex].toLowerCase()}.`,
      },
    });
  }
  
  return visite;
};

function VisualizzaPaziente({ onBack }: VisualizzaPazienteProps) {
  const [codiceFiscale, setCodiceFiscale] = useState<string>('');
  const [paziente, setPaziente] = useState<PazienteCompleto | null>(null);
  const [error, setError] = useState<string>('');
  const [editingSlot, setEditingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<SlotPrenotazione>({ data: '', ora: '', ambulatorio: '' });
  const [selectedVisitaStorico, setSelectedVisitaStorico] = useState<VisitaStorico | null>(null);

  const handleSearch = () => {
    setError('');
    if (!codiceFiscale || codiceFiscale.length !== 16) {
      setError('Inserire un codice fiscale valido (16 caratteri)');
      setPaziente(null);
      return;
    }

    const cfUpper = codiceFiscale.toUpperCase();
    
    // Prima controlla se esiste nei mock predefiniti
    let pazienteTrovato = mockPazienti[cfUpper];
    
    // Se non trovato, genera dati mock dinamicamente
    if (!pazienteTrovato) {
      const datiAnagrafici = generateMockAnagrafica(cfUpper);
      const careGiver = generateMockCareGiver(cfUpper);
      const mmg = generateMockMMG(cfUpper);
      const richiestaAttiva = generateMockRichiestaAttiva(datiAnagrafici);
      const storicoVisite = generateMockStoricoVisite(datiAnagrafici);
      
      pazienteTrovato = {
        datiAnagrafici,
        careGiver, // Sempre presente
        mmg,
        richiestaAttiva, // Sempre presente
        storicoVisite, // Sempre almeno 2 visite
      };
    }

    setPaziente(pazienteTrovato);
  };

  const handleInserisciSlot = () => {
    if (!paziente?.richiestaAttiva || !newSlot.data) {
      alert('Inserire almeno la data dello slot');
      return;
    }

    // Aggiorna la richiesta attiva con lo slot
    if (paziente.richiestaAttiva) {
      const updatedRichiesta = {
        ...paziente.richiestaAttiva,
        slot: newSlot,
        statoSlot: 'prenotato' as const,
        tempoRimanente: 'in tempo',
      };
      setPaziente({
        ...paziente,
        richiestaAttiva: updatedRichiesta,
      });
      setEditingSlot(false);
      alert('Slot prenotato con successo');
    }
  };

  const handleModificaSlot = () => {
    if (paziente?.richiestaAttiva?.slot) {
      setNewSlot(paziente.richiestaAttiva.slot);
      setEditingSlot(true);
    }
  };

  const handleCancellaSlot = () => {
    if (paziente?.richiestaAttiva && confirm('Sei sicuro di voler cancellare lo slot?')) {
      const updatedRichiesta = {
        ...paziente.richiestaAttiva,
        slot: undefined,
        statoSlot: 'da-prenotare' as const,
        tempoRimanente: undefined,
      };
      setPaziente({
        ...paziente,
        richiestaAttiva: updatedRichiesta,
      });
    }
  };

  // Vista dettagli visita storico
  if (selectedVisitaStorico) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedVisitaStorico(null)}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna alla scheda paziente
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-iov-light-blue">
            <div>
              <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Dettagli Visita Storico</h2>
              <p className="text-gray-500 text-sm">
                {selectedVisitaStorico.dataVisita} alle {selectedVisitaStorico.oraVisita} - {selectedVisitaStorico.ambulatorio}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <h3 className="text-xl font-bold text-iov-gray-text mb-4">Informazioni Visita</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data</label>
                  <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.dataVisita}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ora</label>
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

            {selectedVisitaStorico.richiesta && (
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-100 shadow-sm">
                <h3 className="text-xl font-bold text-iov-gray-text mb-4">Dettagli Richiesta Originale</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ambulatorio</label>
                    <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.richiesta.ambulatorio}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Patologia/PDTA</label>
                    <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.richiesta.patologia}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medico Richiedente</label>
                    <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.richiesta.medicoRichiedente}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Richiesta</label>
                    <p className="text-base font-semibold text-iov-gray-text">
                      {selectedVisitaStorico.richiesta.dataRichiesta} alle {selectedVisitaStorico.richiesta.orarioRichiesta}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesito Diagnostico</label>
                    <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {selectedVisitaStorico.richiesta.quesito}
                    </p>
                  </div>
                  {selectedVisitaStorico.richiesta.score !== undefined && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Score</label>
                      <p className="text-base font-semibold text-iov-gray-text">{selectedVisitaStorico.richiesta.score}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista ricerca paziente
  if (!paziente) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna alla Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-iov-gray-text mb-6 flex items-center gap-3">
            <User className="w-8 h-8 text-iov-dark-blue" />
            Visualizza Paziente
          </h2>

          {/* Ricerca per CF */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-iov-gray-text mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Codice Fiscale
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={codiceFiscale}
                onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Inserisci il codice fiscale (16 caratteri)"
                maxLength={16}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                Cerca
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Vista scheda paziente
  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => {
          setPaziente(null);
          setCodiceFiscale('');
          setError('');
          setSelectedVisitaStorico(null);
        }}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium text-base transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla ricerca
      </button>

      {/* Scheda Paziente */}
      <div className="space-y-6">
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
                <p className="text-lg font-mono font-semibold text-iov-gray-text">{paziente.datiAnagrafici.codiceFiscale}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.datiAnagrafici.nome}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.datiAnagrafici.cognome}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Residenza
                </label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.datiAnagrafici.residenza}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Telefono
                </label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.datiAnagrafici.telefono}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.datiAnagrafici.mail}</p>
              </div>
            </div>
          </div>

          {/* Care Giver */}
          {paziente.careGiver && (
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Care Giver</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{paziente.careGiver.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{paziente.careGiver.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{paziente.careGiver.mail}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefono
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{paziente.careGiver.telefono}</p>
                </div>
              </div>
            </div>
          )}

          {/* MMG */}
          <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-iov-gray-text">Medico di Medicina Generale (MMG)</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.mmg.nome}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.mmg.cognome}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Comune di Riferimento</label>
                <p className="text-lg font-semibold text-iov-gray-text">{paziente.mmg.comuneRiferimento}</p>
              </div>
              {paziente.mmg.telefono && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefono
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{paziente.mmg.telefono}</p>
                </div>
              )}
              {paziente.mmg.mail && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-lg font-semibold text-iov-gray-text">{paziente.mmg.mail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Visita Richiesta */}
          {paziente.richiestaAttiva && (
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border-2 border-amber-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Visita Richiesta</h3>
              </div>

              <div className="mb-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ambulatorio</label>
                    <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.ambulatorio}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Patologia/PDTA</label>
                    <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.patologia}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Medico Richiedente</label>
                    <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.medicoRichiedente}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Richiesta</label>
                    <p className="text-base font-semibold text-iov-gray-text">
                      {paziente.richiestaAttiva.dataRichiesta} alle {paziente.richiestaAttiva.orarioRichiesta}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quesito Diagnostico</label>
                    <p className="text-base text-iov-gray-text leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {paziente.richiestaAttiva.quesito}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stato Slot */}
              {paziente.richiestaAttiva.statoSlot === 'da-prenotare' && !editingSlot && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <p className="text-yellow-800 font-semibold mb-4">Slot non ancora prenotato</p>
                  <button
                    onClick={() => {
                      setEditingSlot(true);
                      setNewSlot({ data: '', ora: '', ambulatorio: paziente.richiestaAttiva!.ambulatorio });
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
                    {paziente.richiestaAttiva.statoSlot === 'prenotato' ? 'Modifica Slot' : 'Inserisci Slot'}
                  </h4>
                  {paziente.richiestaAttiva.ambulatorio === 'Osteoncologia' && paziente.richiestaAttiva.richiestaPer?.includes('discussione') && (
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
                        Ora {paziente.richiestaAttiva.ambulatorio === 'Osteoncologia' && paziente.richiestaAttiva.richiestaPer?.includes('discussione') ? '(opzionale)' : ''}
                      </label>
                      <input
                        type="time"
                        value={newSlot.ora || ''}
                        onChange={(e) => setNewSlot({ ...newSlot, ora: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-iov-gray-text mb-2">Medico (opzionale)</label>
                      <input
                        type="text"
                        value={newSlot.medico || ''}
                        onChange={(e) => setNewSlot({ ...newSlot, medico: e.target.value })}
                        placeholder="Es. Dr. Maria Verdi"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleInserisciSlot}
                      className="bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {paziente.richiestaAttiva.statoSlot === 'prenotato' ? 'Salva Modifiche' : 'Conferma Slot'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingSlot(false);
                        if (paziente.richiestaAttiva?.slot) {
                          setNewSlot(paziente.richiestaAttiva.slot);
                        }
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}

              {paziente.richiestaAttiva.statoSlot === 'prenotato' && paziente.richiestaAttiva.slot && !editingSlot && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-green-800 font-semibold">Slot Prenotato</p>
                        {paziente.richiestaAttiva.slot.tipo === 'discussione' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-yellow-100 text-yellow-800 font-semibold text-sm border-2 border-yellow-300">
                            Discussione
                          </span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Data</label>
                          <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.slot.data}</p>
                        </div>
                        {paziente.richiestaAttiva.slot.ora && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Ora</label>
                            <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.slot.ora}</p>
                          </div>
                        )}
                        {paziente.richiestaAttiva.slot.medico && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Medico</label>
                            <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.slot.medico}</p>
                          </div>
                        )}
                        {paziente.richiestaAttiva.tempoRimanente && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Tempo Rimanente</label>
                            <p className="text-base font-semibold text-iov-gray-text">{paziente.richiestaAttiva.tempoRimanente}</p>
                          </div>
                        )}
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
          )}

          {/* Storico Visite */}
          <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-iov-gray-text">Storico Visite</h3>
            </div>

            {paziente.storicoVisite.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nessuna visita presente nello storico</p>
            ) : (
              <div className="space-y-3">
                {paziente.storicoVisite.map((visita) => (
                  <div
                    key={visita.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-iov-dark-blue transition-colors cursor-pointer"
                    onClick={() => setSelectedVisitaStorico(visita)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-iov-gray-text">
                          {visita.dataVisita} alle {visita.oraVisita}
                        </p>
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
  );
}

export default VisualizzaPaziente;

