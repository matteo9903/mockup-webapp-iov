import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import VisiteGiornaliere from './VisiteGiornaliere';
import { VisitaAmbulatorio } from './types';

// Data di oggi per la demo
const oggi = new Date().toISOString().split('T')[0];

// Mock data per Oncogeriatria
const mockVisite: VisitaAmbulatorio[] = [
  // Visite di oggi
  {
    id: 'v-oggi-1',
    ambulatorio: 'Oncogeriatria',
    data: oggi,
    ora: '09:30',
    tipo: 'visita',
    paziente: {
      nome: 'Giuseppe',
      cognome: 'Marino',
      codiceFiscale: 'MRNGPP65E15L219E',
    },
    neoplasia: 'Colon',
    stadio: 'localmente avanzato',
    finalitaTrattamento: 'curativo',
    ecogPS: 1,
    punteggioG8: 13,
    esitoVGM: 'fit',
    quesitoGeriatra: ['Attuabilità programma proposto', 'Necessità di presa in carico durante la terapia: Geriatrica'],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: 'oggi-1',
  },
  {
    id: 'v-oggi-2',
    ambulatorio: 'Oncogeriatria',
    data: oggi,
    ora: '11:00',
    tipo: 'visita',
    paziente: {
      nome: 'Rosa',
      cognome: 'Greco',
      codiceFiscale: 'GRCRSO72F20F205F',
    },
    neoplasia: 'Mammella',
    stadio: 'avanzato/metastatico',
    finalitaTrattamento: 'pallativo',
    ecogPS: 2,
    punteggioG8: 11,
    esitoVGM: 'fragile',
    quesitoGeriatra: [
      'Attuabilità programma proposto',
      'Necessità di presa in carico durante la terapia: Geriatrica',
      'Valutazione rischio cognitive impairment',
    ],
    medicoReferente: 'Dr. Anna Rossi',
    richiestaId: 'oggi-2',
  },
  {
    id: 'v-oggi-3',
    ambulatorio: 'Oncogeriatria',
    data: oggi,
    ora: '14:30',
    tipo: 'visita',
    paziente: {
      nome: 'Antonio',
      cognome: 'Bruno',
      codiceFiscale: 'BRNNTN68M05H501G',
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
    richiestaId: 'oggi-3',
  },
  // Visite storiche
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
];

function AmbulatorioOncogeriatria() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/clinici-iov');
  };

  return (
    <div className="min-h-screen bg-iov-gradient">
      <Header 
        title="Portale Ambulatorio Oncogeriatria"
        subtitle="Area Ambulatorio Oncogeriatria"
      />
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <VisiteGiornaliere ambulatorio="Oncogeriatria" visite={mockVisite} />
      </main>
    </div>
  );
}

export default AmbulatorioOncogeriatria;
