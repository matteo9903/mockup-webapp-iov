import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, FileText, Eye, Download } from 'lucide-react';
import { Ambulatorio, VisitaAmbulatorio } from './types';

interface VisiteAmbulatoriProps {
  onBack: () => void;
}

// Mock data per le visite
const mockVisite: VisitaAmbulatorio[] = [
  // Cure Simultanee
  {
    id: 'v1',
    ambulatorio: 'Cure Simultanee',
    data: '15-02-2024',
    ora: '10:00',
    tipo: 'visita',
    paziente: {
      nome: 'Mario',
      cognome: 'Rossi',
      codiceFiscale: 'RSSMRA80A01H501U',
    },
    problemi: 'Valutazione per terapia combinata chemio-radioterapia. Paziente con neoplasia polmonare localmente avanzata.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: '1',
  },
  {
    id: 'v2',
    ambulatorio: 'Cure Simultanee',
    data: '15-02-2024',
    ora: '11:00',
    tipo: 'visita',
    paziente: {
      nome: 'Giuliano',
      cognome: 'Marrone',
      codiceFiscale: 'MRNGLN82G20H501K',
    },
    problemi: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma del retto localmente avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: '7',
  },
  {
    id: 'v3',
    ambulatorio: 'Cure Simultanee',
    data: '20-02-2024',
    ora: '09:30',
    tipo: 'visita',
    paziente: {
      nome: 'Marco',
      cognome: 'Blu',
      codiceFiscale: 'BLUMRC70E25L219Y',
    },
    problemi: 'Valutazione per terapia combinata in paziente con neoplasia polmonare avanzata. Necessità di valutazione multidisciplinare.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: '5',
  },
  {
    id: 'v4',
    ambulatorio: 'Cure Simultanee',
    data: '22-02-2024',
    ora: '09:00',
    tipo: 'visita',
    paziente: {
      nome: 'Giovanni',
      cognome: 'Rosa',
      codiceFiscale: 'RSSGNN80R20H501V',
    },
    problemi: 'Valutazione per trattamento combinato in paziente con melanoma avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: '16',
  },
  // Oncogeriatria
  {
    id: 'v5',
    ambulatorio: 'Oncogeriatria',
    data: '10-02-2024',
    ora: '14:30',
    tipo: 'visita',
    paziente: {
      nome: 'Luca',
      cognome: 'Verdi',
      codiceFiscale: 'VRDLCA90C20F205Z',
    },
    neoplasia: 'Colon',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 1,
    punteggioG8: 14,
    esitoVGM: 'fit',
    quesitoGeriatra: ['Attuabilità programma proposto', 'Necessità di presa in carico durante la terapia: Geriatrica'],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: '3',
  },
  {
    id: 'v6',
    ambulatorio: 'Oncogeriatria',
    data: '12-02-2024',
    ora: '10:00',
    tipo: 'visita',
    paziente: {
      nome: 'Anna',
      cognome: 'Verdi',
      codiceFiscale: 'VRDANNA55N20F205R',
    },
    neoplasia: 'Mammella',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 2,
    punteggioG8: 10,
    esitoVGM: 'fragile',
    quesitoGeriatra: [
      'Attuabilità programma proposto',
      'Necessità di presa in carico durante la terapia: Geriatrica',
      'Valutazione rischio cognitive impairment',
      'Revisione polifarmacoterapia',
    ],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: '12',
  },
  {
    id: 'v7',
    ambulatorio: 'Oncogeriatria',
    data: '14-02-2024',
    ora: '11:30',
    tipo: 'visita',
    paziente: {
      nome: 'Marina',
      cognome: 'Gialli',
      codiceFiscale: 'GRNMRN78P25L219T',
    },
    neoplasia: 'Colon',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 0,
    punteggioG8: 16,
    esitoVGM: 'fit',
    quesitoGeriatra: ['Attuabilità programma proposto'],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: '14',
  },
  // Osteoncologia
  {
    id: 'v8',
    ambulatorio: 'Osteoncologia',
    data: '05-02-2024',
    ora: '08:30',
    tipo: 'visita',
    paziente: {
      nome: 'Lucia',
      cognome: 'Rosa',
      codiceFiscale: 'RSSLCA65H10L219M',
    },
    problemi: 'Valutazione urgente per metastasi ossee multiple. Paziente con carcinoma prostatico metastatico e sintomi neurologici.',
    quesito: 'Valutazione urgente per metastasi ossee multiple con sintomi neurologici.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '8',
  },
  {
    id: 'v9',
    ambulatorio: 'Osteoncologia',
    data: '05-02-2024',
    tipo: 'discussione',
    paziente: {
      nome: 'Paolo',
      cognome: 'Verdi',
      codiceFiscale: 'VRDPLA72I25F205N',
    },
    problemi: 'Valutazione metastasi ossee in paziente con carcinoma polmonare metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee e gestione del dolore.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '9',
  },
  {
    id: 'v10',
    ambulatorio: 'Osteoncologia',
    data: '25-02-2024',
    ora: '15:00',
    tipo: 'visita',
    paziente: {
      nome: 'Giorgio',
      cognome: 'Bianchi',
      codiceFiscale: 'BNCGRN68L15H501P',
    },
    problemi: 'Valutazione metastasi ossee in paziente con carcinoma mammario metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '10',
  },
  // Altre visite Cure Simultanee
  {
    id: 'v11',
    ambulatorio: 'Cure Simultanee',
    data: '15-02-2024',
    ora: '14:00',
    tipo: 'visita',
    paziente: {
      nome: 'Giorgio',
      cognome: 'Marrone',
      codiceFiscale: 'MRNGRN71V15L219Z',
    },
    problemi: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma del retto localmente avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: '20',
  },
  {
    id: 'v12',
    ambulatorio: 'Cure Simultanee',
    data: '18-02-2024',
    ora: '10:30',
    tipo: 'visita',
    paziente: {
      nome: 'Paolo',
      cognome: 'Marrone',
      codiceFiscale: 'MRNPLA73Q15F205U',
    },
    problemi: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma gastrico localmente avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: '15',
  },
  // Altre visite Oncogeriatria
  {
    id: 'v13',
    ambulatorio: 'Oncogeriatria',
    data: '10-02-2024',
    ora: '16:00',
    tipo: 'visita',
    paziente: {
      nome: 'Franco',
      cognome: 'Blu',
      codiceFiscale: 'BLUFRN60O10H501S',
    },
    neoplasia: 'Polmone',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 1,
    punteggioG8: 12,
    esitoVGM: 'vulnerabile',
    quesitoGeriatra: [
      'Attuabilità programma proposto',
      'Necessità di presa in carico durante la terapia: Di altro specialista',
      'Revisione polifarmacoterapia',
    ],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: '13',
  },
  {
    id: 'v14',
    ambulatorio: 'Oncogeriatria',
    data: '12-02-2024',
    ora: '15:30',
    tipo: 'visita',
    paziente: {
      nome: 'Marina',
      cognome: 'Gialli',
      codiceFiscale: 'GRNMRN78P25L219T',
    },
    neoplasia: 'Colon',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 0,
    punteggioG8: 16,
    esitoVGM: 'fit',
    quesitoGeriatra: ['Attuabilità programma proposto'],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: '14',
  },
  // Altre visite e discussioni Osteoncologia
  {
    id: 'v15',
    ambulatorio: 'Osteoncologia',
    data: '05-02-2024',
    ora: '11:00',
    tipo: 'visita',
    paziente: {
      nome: 'Marco',
      cognome: 'Neri',
      codiceFiscale: 'NRIMRC75M05L219Q',
    },
    problemi: 'Valutazione metastasi ossee multiple in paziente con carcinoma del colon metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee e gestione del dolore.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '11',
  },
  {
    id: 'v16',
    ambulatorio: 'Osteoncologia',
    data: '05-02-2024',
    tipo: 'discussione',
    paziente: {
      nome: 'Franco',
      cognome: 'Blu',
      codiceFiscale: 'BLUFRN82T10H501X',
    },
    problemi: 'Discussione multidisciplinare per metastasi ossee multiple in paziente con carcinoma prostatico metastatico.',
    quesito: 'Discussione multidisciplinare per valutazione trattamento delle metastasi ossee multiple.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '18',
  },
  {
    id: 'v17',
    ambulatorio: 'Osteoncologia',
    data: '28-02-2024',
    tipo: 'discussione',
    paziente: {
      nome: 'Giuliano',
      cognome: 'Verdi',
      codiceFiscale: 'VRDGLN77S25L219W',
    },
    problemi: 'Valutazione metastasi ossee in paziente con carcinoma polmonare metastatico. Necessità di discussione multidisciplinare.',
    quesito: 'Discussione multidisciplinare per valutazione trattamento delle metastasi ossee.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '17',
  },
  {
    id: 'v18',
    ambulatorio: 'Osteoncologia',
    data: '01-03-2024',
    ora: '09:00',
    tipo: 'visita',
    paziente: {
      nome: 'Paola',
      cognome: 'Gialli',
      codiceFiscale: 'GRNPLA69U20F205Y',
    },
    problemi: 'Valutazione metastasi ossee. Possibilità di visita o discussione multidisciplinare.',
    quesito: 'Valutazione trattamento delle metastasi ossee.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: '19',
  },
];

function VisiteAmbulatori({ onBack }: VisiteAmbulatoriProps) {
  const [ambulatorioAttivo, setAmbulatorioAttivo] = useState<Ambulatorio>('Cure Simultanee');
  const [dateSelezionate, setDateSelezionate] = useState<Record<Ambulatorio, string>>({
    'Cure Simultanee': '15-02-2024',
    'Oncogeriatria': '10-02-2024',
    'Osteoncologia': '05-02-2024',
  });
  const [selectedVisita, setSelectedVisita] = useState<VisitaAmbulatorio | null>(null);

  const tuttiAmbulatori: Ambulatorio[] = ['Cure Simultanee', 'Oncogeriatria', 'Osteoncologia'];

  const visiteFiltrate = mockVisite.filter(visita => {
    return visita.ambulatorio === ambulatorioAttivo && 
           visita.data === dateSelezionate[ambulatorioAttivo];
  });

  const visitePerAmbulatorio = tuttiAmbulatori.map(amb => ({
    ambulatorio: amb,
    visite: mockVisite.filter(v => v.ambulatorio === amb),
    count: mockVisite.filter(v => v.ambulatorio === amb).length,
  }));

  const handleViewDetails = (visita: VisitaAmbulatorio) => {
    setSelectedVisita(visita);
  };

  const handleExportVisite = () => {
    if (visiteFiltrate.length === 0) {
      alert('Nessuna visita da esportare per questa data');
      return;
    }

    // Crea il contenuto CSV
    const headers = [
      'Ora',
      'Tipo',
      'Nome',
      'Cognome',
      'Codice Fiscale',
      'Medico Referente',
    ];

    // Aggiungi colonne specifiche per ambulatorio
    if (ambulatorioAttivo === 'Cure Simultanee') {
      headers.push('Problemi');
    } else if (ambulatorioAttivo === 'Oncogeriatria') {
      headers.push('Neoplasia', 'Stadio', 'Finalità Trattamento', 'ECOG PS', 'Punteggio G8', 'Esito VGM', 'Quesito per Geriatra');
    } else if (ambulatorioAttivo === 'Osteoncologia') {
      headers.push('Problemi', 'Quesito');
    }

    const rows = visiteFiltrate
      .sort((a, b) => {
        if (!a.ora && !b.ora) return 0;
        if (!a.ora) return 1;
        if (!b.ora) return -1;
        return a.ora.localeCompare(b.ora);
      })
      .map(visita => {
        const baseRow = [
          visita.ora || (visita.tipo === 'discussione' ? 'Discussione' : '-'),
          visita.tipo === 'discussione' ? 'Discussione' : 'Visita',
          visita.paziente.nome,
          visita.paziente.cognome,
          visita.paziente.codiceFiscale,
          visita.medicoReferente || '-',
        ];

        if (ambulatorioAttivo === 'Cure Simultanee') {
          baseRow.push(visita.problemi || '-');
        } else if (ambulatorioAttivo === 'Oncogeriatria') {
          baseRow.push(
            visita.neoplasia || '-',
            visita.stadio || '-',
            visita.finalitaTrattamento || '-',
            visita.ecogPS !== undefined ? visita.ecogPS.toString() : '-',
            visita.punteggioG8 !== undefined ? visita.punteggioG8.toString() : '-',
            visita.esitoVGM || '-',
            visita.quesitoGeriatra ? visita.quesitoGeriatra.join('; ') : '-'
          );
        } else if (ambulatorioAttivo === 'Osteoncologia') {
          baseRow.push(
            visita.problemi || '-',
            visita.quesito || '-'
          );
        }

        return baseRow;
      });

    // Converti in CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Crea e scarica il file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visite_${ambulatorioAttivo.replace(/\s+/g, '_')}_${dateSelezionate[ambulatorioAttivo]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDettagliAmbulatorio = (visita: VisitaAmbulatorio) => {
    switch (visita.ambulatorio) {
      case 'Cure Simultanee':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Problemi</label>
              <p className="text-sm text-iov-gray-text">{visita.problemi || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medico Referente</label>
              <p className="text-sm text-iov-gray-text font-medium">{visita.medicoReferente || '-'}</p>
            </div>
          </div>
        );
      case 'Oncogeriatria':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Neoplasia</label>
              <p className="text-sm text-iov-gray-text">{visita.neoplasia || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Stadio</label>
              <p className="text-sm text-iov-gray-text">{visita.stadio || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Finalità Trattamento</label>
              <p className="text-sm text-iov-gray-text">{visita.finalitaTrattamento || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ECOG PS</label>
              <p className="text-sm text-iov-gray-text">{visita.ecogPS !== undefined ? visita.ecogPS : '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Punteggio G8</label>
              <p className="text-sm text-iov-gray-text">{visita.punteggioG8 !== undefined ? visita.punteggioG8 : '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Esito VGM</label>
              <p className="text-sm text-iov-gray-text">{visita.esitoVGM || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Quesito per Geriatra</label>
              <div className="text-sm text-iov-gray-text">
                {visita.quesitoGeriatra && visita.quesitoGeriatra.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {visita.quesitoGeriatra.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                ) : (
                  '-'
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medico Referente</label>
              <p className="text-sm text-iov-gray-text font-medium">{visita.medicoReferente || '-'}</p>
            </div>
          </div>
        );
      case 'Osteoncologia':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Problemi</label>
              <p className="text-sm text-iov-gray-text">{visita.problemi || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Quesito</label>
              <p className="text-sm text-iov-gray-text">{visita.quesito || '-'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Medico Referente</label>
              <p className="text-sm text-iov-gray-text font-medium">{visita.medicoReferente || '-'}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
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
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-iov-light-blue-light text-iov-dark-blue font-semibold text-sm">
                {selectedVisita.ambulatorio}
              </span>
              {selectedVisita.tipo === 'discussione' && (
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-semibold text-sm">
                  Discussione
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Dati Paziente */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dati Paziente</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.paziente.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.paziente.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Codice Fiscale</label>
                  <p className="text-lg font-mono font-semibold text-iov-gray-text">{selectedVisita.paziente.codiceFiscale}</p>
                </div>
              </div>
            </div>

            {/* Dati Visita */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dati Visita</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data</label>
                  <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.data}</p>
                </div>
                {selectedVisita.ora && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ora</label>
                    <p className="text-lg font-semibold text-iov-gray-text">{selectedVisita.ora}</p>
                  </div>
                )}
                {selectedVisita.tipo && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo</label>
                    <p className="text-lg font-semibold text-iov-gray-text capitalize">{selectedVisita.tipo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dettagli Specifici Ambulatorio */}
            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-iov-dark-blue flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-iov-gray-text">Dettagli {selectedVisita.ambulatorio}</h3>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                {renderDettagliAmbulatorio(selectedVisita)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
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
            Visite Ambulatori
          </h2>
        </div>

        {/* Tab per ambulatori */}
        <div className="mb-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {visitePerAmbulatorio.map(({ ambulatorio, count }) => (
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

        {/* Selezione data e esportazione */}
        <div className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-iov-gray-text mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Seleziona Data
            </label>
            <input
              type="date"
              value={dateSelezionate[ambulatorioAttivo]}
              onChange={(e) => {
                setDateSelezionate({
                  ...dateSelezionate,
                  [ambulatorioAttivo]: e.target.value,
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue"
            />
          </div>
          {visiteFiltrate.length > 0 && (
            <button
              onClick={handleExportVisite}
              className="flex items-center gap-2 px-6 py-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Download className="w-5 h-5" />
              <span>Esporta Visite</span>
            </button>
          )}
        </div>

        {/* Lista visite */}
        {visiteFiltrate.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nessuna visita presente per questa data
          </div>
        ) : (
          <div className="space-y-4">
            {visiteFiltrate
              .sort((a, b) => {
                // Ordina per ora se presente, altrimenti le discussioni vanno dopo
                if (!a.ora && !b.ora) return 0;
                if (!a.ora) return 1;
                if (!b.ora) return -1;
                return a.ora.localeCompare(b.ora);
              })
              .map((visita) => (
                <div
                  key={visita.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-iov-dark-blue"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        {visita.ora && (
                          <div className="flex items-center gap-2 bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-semibold">
                            <Clock className="w-5 h-5" />
                            {visita.ora}
                          </div>
                        )}
                        {visita.tipo === 'discussione' && (
                          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold border-2 border-yellow-300">
                            <FileText className="w-5 h-5" />
                            Discussione
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-iov-dark-blue" />
                          <span className="text-xl font-bold text-iov-gray-text">
                            {visita.paziente.nome} {visita.paziente.cognome}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Codice Fiscale</label>
                          <p className="text-sm text-iov-gray-text font-mono">{visita.paziente.codiceFiscale}</p>
                        </div>
                      </div>

                      {/* Dettagli specifici per ambulatorio */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {renderDettagliAmbulatorio(visita)}
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => handleViewDetails(visita)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Dettagli</span>
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

export default VisiteAmbulatori;

