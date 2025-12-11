import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import VisiteGiornaliere from './VisiteGiornaliere';
import { VisitaAmbulatorio } from './types';

// Data di oggi per la demo
const oggi = new Date().toISOString().split('T')[0];

// Mock data per Osteoncologia
const mockVisite: VisitaAmbulatorio[] = [
  // Visite di oggi
  {
    id: 'v-oggi-1',
    ambulatorio: 'Osteoncologia',
    data: oggi,
    ora: '08:00',
    tipo: 'visita',
    paziente: {
      nome: 'Francesco',
      cognome: 'Costa',
      codiceFiscale: 'CSTFRN75A18L219H',
    },
    problemi: 'Valutazione urgente per metastasi ossee multiple. Paziente con carcinoma prostatico metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee multiple.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: 'oggi-1',
  },
  {
    id: 'v-oggi-2',
    ambulatorio: 'Osteoncologia',
    data: oggi,
    tipo: 'discussione',
    paziente: {
      nome: 'Elena',
      cognome: 'Fontana',
      codiceFiscale: 'FNTELN80B25F205I',
    },
    problemi: 'Discussione multidisciplinare per metastasi ossee in paziente con carcinoma mammario metastatico.',
    quesito: 'Discussione multidisciplinare per valutazione trattamento delle metastasi ossee.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: 'oggi-2',
  },
  {
    id: 'v-oggi-3',
    ambulatorio: 'Osteoncologia',
    data: oggi,
    ora: '10:00',
    tipo: 'visita',
    paziente: {
      nome: 'Roberto',
      cognome: 'Caruso',
      codiceFiscale: 'CRSRRT77C12H501J',
    },
    problemi: 'Valutazione metastasi ossee in paziente con carcinoma polmonare metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee e gestione del dolore.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: 'oggi-3',
  },
  {
    id: 'v-oggi-4',
    ambulatorio: 'Osteoncologia',
    data: oggi,
    ora: '11:30',
    tipo: 'visita',
    paziente: {
      nome: 'Caterina',
      cognome: 'Mancini',
      codiceFiscale: 'MNCCTR73D30L219K',
    },
    problemi: 'Valutazione metastasi ossee multiple in paziente con carcinoma del colon metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee e gestione del dolore.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: 'oggi-4',
  },
  {
    id: 'v-oggi-5',
    ambulatorio: 'Osteoncologia',
    data: oggi,
    ora: '15:00',
    tipo: 'visita',
    paziente: {
      nome: 'Stefano',
      cognome: 'Rizzo',
      codiceFiscale: 'RZZSFN88E05F205L',
    },
    problemi: 'Valutazione metastasi ossee in paziente con carcinoma mammario metastatico.',
    quesito: 'Valutazione trattamento delle metastasi ossee.',
    medicoReferente: 'Dr. Paolo Neri',
    richiestaId: 'oggi-5',
  },
  // Visite storiche
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

function AmbulatorioOsteoncologia() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/clinici-iov');
  };

  return (
    <div className="min-h-screen bg-iov-gradient">
      <Header 
        title="Portale Ambulatorio Osteoncologia"
        subtitle="Area Ambulatorio Osteoncologia"
      />
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <VisiteGiornaliere ambulatorio="Osteoncologia" visite={mockVisite} />
      </main>
    </div>
  );
}

export default AmbulatorioOsteoncologia;
