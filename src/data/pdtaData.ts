export interface PDTA {
  id: string;
  name: string;
  exams: string[];
}

export const pdtaData: PDTA[] = [
  {
    id: 'polmone',
    name: 'Polmone',
    exams: [
      'Rx torace',
      'TC torace',
      'Visita pneumologica',
      'Biopsia ed esame istologico',
    ],
  },
  {
    id: 'prostata',
    name: 'Prostata',
    exams: [
      'Visita urologica + ER + PSA',
      'RM prostatica multiparametrica',
      'Biopsia prostatica',
    ],
  },
  {
    id: 'colon',
    name: 'Colon',
    exams: [
      'Visita specialistica',
      'Pancolonscopia con biopsia',
      'Esame istologico',
    ],
  },
  {
    id: 'retto',
    name: 'Retto',
    exams: [
      'Visita specialistica',
      'Pancolonscopia con biopsia',
      'Esame istologico',
    ],
  },
  {
    id: 'melanoma',
    name: 'Melanoma',
    exams: [
      'Visita dermatologica con dermatoscopia',
      'Biopsia escissionale ed esame istologico',
    ],
  },
  {
    id: 'mammella',
    name: 'Mammella',
    exams: [
      'Visita senologica',
      'Mammografia bilaterale',
      'Ecografia bilaterale',
      'Biopsia ed esame istologico',
    ],
  },
  {
    id: 'stomaco',
    name: 'Stomaco',
    exams: [
      'EGDS con biopsia',
      'Esame istologico',
    ],
  },
  {
    id: 'sarcomi',
    name: 'Sarcomi dei tessuti molli',
    exams: [
      'Visita chirurgica',
      'Ecografia dei tessuti molli',
      'Risonanza magnetica',
      'Biopsia ed esame istologico',
    ],
  },
  {
    id: 'snc',
    name: 'Sistema nervoso centrale',
    exams: [
      'Visita neurologica',
      'RMN o TC',
    ],
  },
];
