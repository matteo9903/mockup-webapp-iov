export type CaseManagerPage = 'home' | 'triage' | 'elenco-richieste-ambulatori' | 'visite-ambulatori' | 'visualizza-paziente';

export interface DatiAnagrafici {
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  residenza: string;
  telefono: string;
  mail: string;
}

export interface CareGiver {
  nome: string;
  cognome: string;
  mail: string;
  telefono: string;
}

export interface MMG {
  nome: string;
  cognome: string;
  comuneRiferimento: string;
  mail: string;
  telefono: string;
}

export interface TriageData {
  codiceFiscale: string;
  datiAnagrafici?: DatiAnagrafici;
  careGiver?: CareGiver;
  mmg?: MMG;
  impegnativaFile?: string;
  pdtaSelezionato?: string;
  checklistCompletata: Record<string, boolean>;
  note?: string;
  completato: boolean;
  dataTriage?: string;
}

export type Ambulatorio = 'Cure Simultanee' | 'Oncogeriatria' | 'Osteoncologia';

export type PDTA = 
  | 'Prostata'
  | 'Polmone'
  | 'Colon'
  | 'Retto'
  | 'Stomaco'
  | 'Sarcomi dei tessuti molli'
  | 'Melanoma'
  | 'Mammella'
  | 'Sistema nervoso centrale';

export interface SlotPrenotazione {
  data: string;
  ora?: string; // Opzionale per discussioni in Osteoncologia
  ambulatorio: string;
  medico?: string;
  tipo?: 'visita' | 'discussione'; // Solo per Osteoncologia
}

export interface RichiestaAmbulatorio {
  id: string;
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  residenza: string;
  telefono: string;
  mail: string;
  ambulatorio: Ambulatorio;
  patologia: PDTA;
  medicoRichiedente: string;
  score?: number;
  livelloUrgenza?: string;
  slot?: SlotPrenotazione;
  tempoRimanente?: string; // "3 giorni", "in tempo", "fuori tempo"
  statoSlot: 'da-prenotare' | 'prenotato';
  impegnativaFile?: string;
  dataRichiesta: string;
  orarioRichiesta: string;
  quesito: string;
  // Campi condizionali (stessi di RichiestaPrenotazione)
  uoRiferimento?: string;
  uoRiferimentoAltro?: string;
  sopravvivenzaStimata?: string;
  quesitoTeam?: string;
  richiestaPer?: string[];
  stadio?: string;
  finalitaTrattamento?: string;
  ecogPS?: number;
  punteggioG8?: number;
  esitoVGM?: string;
  propostaTerapeutica?: string;
  prognosiOncologica?: string;
  finalitaTerapia?: string[];
  tossicitaEmatologica?: number;
  tossicitaExtraEmatologica?: number;
  quesitiGeriatra?: string[];
  quesitiGeriatraAltro?: string;
  programmaAttuabile?: boolean;
  presaInCaricoGeriatrica?: boolean;
  presaInCaricoGeriatricaTempistica?: string;
  presaInCaricoAltroSpecialista?: boolean;
  presaInCaricoAltroSpecialistaDettaglio?: string;
  rischioCognitiveImpairment?: string;
  rischioCognitiveImpairmentDettaglio?: string;
  revisionePolifarmacoterapia?: boolean;
  revisionePolifarmacoterapiaDettaglio?: string;
  attivazioneServiziDomiciliari?: boolean;
  altroOutput?: string;
  psKarnofsky?: string;
  sopravvivenzaStimataScore?: string;
  sintomi?: string[];
  trattamentiImpatto?: string;
  tossicitaAttesa?: string;
  problemiSocioAssistenziali?: string;
  segniSintomi?: string;
  metastasiViscerali?: string;
  nMetastasiVertebrali?: string;
  sedeMalattiaPrimitiva?: string;
  situazioniUrgenti?: string[];
  tosse?: string;
  dolore?: string;
  comorbidita?: string;
}

export interface VisitaStorico {
  id: string;
  dataVisita: string;
  oraVisita: string;
  ambulatorio: string;
  medico?: string;
  richiestaId: string;
  // Dettagli della richiesta originale
  richiesta?: RichiestaAmbulatorio;
}

export interface VisitaAmbulatorio {
  id: string;
  ambulatorio: Ambulatorio;
  data: string;
  ora?: string; // Opzionale per discussioni in Osteoncologia
  tipo?: 'visita' | 'discussione'; // Solo per Osteoncologia
  paziente: {
    nome: string;
    cognome: string;
    codiceFiscale: string;
  };
  // Dati specifici per ambulatorio
  // Cure Simultanee
  problemi?: string;
  medicoReferente?: string;
  // Oncogeriatria
  neoplasia?: PDTA;
  stadio?: string;
  finalitaTrattamento?: string;
  ecogPS?: number;
  punteggioG8?: number;
  esitoVGM?: string;
  quesitoGeriatra?: string[];
  // Osteoncologia
  quesito?: string;
  richiestaId: string;
  richiesta?: RichiestaAmbulatorio;
}

