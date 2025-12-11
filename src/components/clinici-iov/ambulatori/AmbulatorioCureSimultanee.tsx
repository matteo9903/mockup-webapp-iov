import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import VisiteGiornaliere from './VisiteGiornaliere';
import { VisitaAmbulatorio } from './types';

// Data di oggi per la demo
const oggi = new Date().toISOString().split('T')[0];

// Mock data per Cure Simultanee
const mockVisite: VisitaAmbulatorio[] = [
  // Visite di oggi
  {
    id: 'v-oggi-1',
    ambulatorio: 'Cure Simultanee',
    data: oggi,
    ora: '09:00',
    tipo: 'visita',
    paziente: {
      nome: 'Alessandro',
      cognome: 'Ferrari',
      codiceFiscale: 'FRRLSN85M15H501A',
    },
    problemi: 'Valutazione per terapia combinata chemio-radioterapia in paziente con neoplasia polmonare localmente avanzata. Prima visita.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: 'oggi-1',
  },
  {
    id: 'v-oggi-2',
    ambulatorio: 'Cure Simultanee',
    data: oggi,
    ora: '10:30',
    tipo: 'visita',
    paziente: {
      nome: 'Sofia',
      cognome: 'Romano',
      codiceFiscale: 'RMNSFO78F22L219B',
    },
    problemi: 'Valutazione per trattamento combinato in paziente con carcinoma mammario localmente avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: 'oggi-2',
  },
  {
    id: 'v-oggi-3',
    ambulatorio: 'Cure Simultanee',
    data: oggi,
    ora: '14:00',
    tipo: 'visita',
    paziente: {
      nome: 'Lorenzo',
      cognome: 'Colombo',
      codiceFiscale: 'CLMLRN82A10F205C',
    },
    problemi: 'Valutazione per terapia combinata chemio-radioterapia in paziente con carcinoma del retto localmente avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: 'oggi-3',
  },
  {
    id: 'v-oggi-4',
    ambulatorio: 'Cure Simultanee',
    data: oggi,
    ora: '15:30',
    tipo: 'visita',
    paziente: {
      nome: 'Giulia',
      cognome: 'Ricci',
      codiceFiscale: 'RCCGLA90D25H501D',
    },
    problemi: 'Valutazione per trattamento combinato in paziente con carcinoma gastrico localmente avanzato.',
    medicoReferente: 'Dr. Maria Verdi',
    richiestaId: 'oggi-4',
  },
  // Visite storiche
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
];

function AmbulatorioCureSimultanee() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/clinici-iov');
  };

  return (
    <div className="min-h-screen bg-iov-gradient">
      <Header 
        title="Portale Ambulatorio Cure Simultanee"
        subtitle="Area Ambulatorio Cure Simultanee"
      />
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <VisiteGiornaliere ambulatorio="Cure Simultanee" visite={mockVisite} />
      </main>
    </div>
  );
}

export default AmbulatorioCureSimultanee;
