export type CaseManagerSoniaSabrinaPage = 'home' | 'triage' | 'elenco-pazienti';

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

export interface DocumentoReferto {
  id: string;
  nomeVisita: string;
  nomeFile: string;
  dataCaricamento: string;
}

export interface TriageDataSoniaSabrina {
  codiceFiscale: string;
  datiAnagrafici?: DatiAnagrafici;
  careGiver?: CareGiver;
  mmg?: MMG;
  impegnativaFile?: string;
  pdtaSelezionato?: string;
  checklistCompletata: Record<string, boolean>;
  documentiReferti: Record<string, DocumentoReferto[]>; // Per ogni visita, lista di documenti
  note?: string;
  completato: boolean;
  dataTriage?: string;
}

export interface PazienteTriage {
  id: string;
  codiceFiscale: string;
  nome: string;
  cognome: string;
  dataTriage: string;
  pdtaSelezionato: string;
  documentiCaricati: Record<string, DocumentoReferto[]>; // Per ogni visita, lista di documenti
  checklistCompletata: Record<string, boolean>;
}

