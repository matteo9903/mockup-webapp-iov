export type OncologoPage = 'home' | 'richiesta-prenotazione' | 'elenco-richieste' | 'notifiche' | 'storico-visite';

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

export interface RichiestaPrenotazione {
  id: string;
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  ambulatorio: Ambulatorio;
  patologia: PDTA;
  quesito: string;
  impegnativaFile?: string;
  score?: number;
  livelloUrgenza?: string;
  stato: 'in-attesa' | 'prenotato' | 'rifiutato';
  dataRichiesta: string;
  orarioRichiesta: string;
  dataPrenotazione?: string;
  orarioPrenotazione?: string;
  // Campi condizionali per Osteoncologia
  uoRiferimento?: string;
  uoRiferimentoAltro?: string;
  sopravvivenzaStimata?: string;
  quesitoTeam?: string;
  richiestaPer?: string[];
  // Campi condizionali per Oncogeriatria
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
  // Output valutazione geriatrica
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
  // Valutazione score clinico
  psKarnofsky?: string;
  sopravvivenzaStimataScore?: string;
  sintomi?: string[];
  trattamentiImpatto?: string;
  tossicitaAttesa?: string;
  problemiSocioAssistenziali?: string;
  // Per Osteoncologia
  segniSintomi?: string;
  metastasiViscerali?: string;
  nMetastasiVertebrali?: string;
  sedeMalattiaPrimitiva?: string;
  situazioniUrgenti?: string[];
  // Per altri ambulatori
  tosse?: string;
  dolore?: string;
  comorbidita?: string;
}

export interface Notifica {
  id: string;
  pazienteNome: string;
  pazienteCognome: string;
  codiceFiscale: string;
  dataVisita: string;
  ambulatorio: Ambulatorio;
  messaggio: string;
  letta: boolean;
  dataNotifica: string;
  richiestaId: string; // ID della richiesta originale
}

export interface VisitaStorico {
  id: string;
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  dataVisita: string;
  ambulatorio: Ambulatorio;
  patologia: PDTA;
  stato: 'completata' | 'annullata';
  // Dati della richiesta originale
  quesito?: string;
  impegnativaFile?: string;
  score?: number;
  livelloUrgenza?: string;
  dataRichiesta: string;
  orarioRichiesta: string;
  // Campi condizionali per Osteoncologia
  uoRiferimento?: string;
  uoRiferimentoAltro?: string;
  sopravvivenzaStimata?: string;
  quesitoTeam?: string;
  richiestaPer?: string[];
  // Campi condizionali per Oncogeriatria
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
  // Output valutazione geriatrica
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
  // Valutazione score clinico
  psKarnofsky?: string;
  sopravvivenzaStimataScore?: string;
  sintomi?: string[];
  trattamentiImpatto?: string;
  tossicitaAttesa?: string;
  problemiSocioAssistenziali?: string;
  // Per Osteoncologia
  segniSintomi?: string;
  metastasiViscerali?: string;
  nMetastasiVertebrali?: string;
  sedeMalattiaPrimitiva?: string;
  situazioniUrgenti?: string[];
  // Per altri ambulatori
  tosse?: string;
  dolore?: string;
  comorbidita?: string;
}

