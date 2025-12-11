export type AmbulatorioPage = 'home' | 'visite-giornaliere';

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
  richiesta?: any;
}


