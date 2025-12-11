# MMG Mockup - Demo Punto Di Accoglienza IOV

Demo interattiva del sistema di Punto Di Accoglienza dell'Istituto Oncologico Veneto (IOV), sviluppata per mostrare le funzionalità delle diverse piattaforme destinate a MMG (Medici di Medicina Generale), Clinici IOV e Pazienti.

## 📋 Indice

- [Panoramica](#panoramica)
- [Tecnologie](#tecnologie)
- [Struttura del Progetto](#struttura-del-progetto)
- [Installazione](#installazione)
- [Script Disponibili](#script-disponibili)
- [Architettura](#architettura)
- [Piattaforme](#piattaforme)
- [Schema Colori](#schema-colori)
- [Convenzioni di Sviluppo](#convenzioni-di-sviluppo)

## 🎯 Panoramica

Questo progetto è una demo interattiva che simula il sistema di gestione del Punto Di Accoglienza IOV, permettendo a diversi stakeholder di accedere alle proprie aree dedicate:

- **MMG**: Area per Medici di Medicina Generale
- **Clinici IOV**: Area per specialisti, case manager e ambulatori
- **Paziente**: Area per i pazienti

Ogni piattaforma offre funzionalità specifiche per il proprio ruolo, con un'interfaccia moderna e intuitiva basata sul design system IOV.

## 🛠 Tecnologie

### Core
- **React 18.3.1**: Libreria UI
- **TypeScript 5.5.3**: Tipizzazione statica
- **Vite 5.4.2**: Build tool e dev server

### Routing
- **React Router DOM 7.9.5**: Gestione routing e navigazione

### Styling
- **Tailwind CSS 3.4.1**: Framework CSS utility-first
- **PostCSS 8.4.35**: Processore CSS
- **Autoprefixer 10.4.18**: Aggiunta automatica vendor prefixes

### Icons
- **Lucide React 0.344.0**: Libreria di icone

### Backend (Preparato)
- **Supabase 2.57.4**: Backend-as-a-Service (configurato ma non ancora integrato)

### Development Tools
- **ESLint 9.9.1**: Linter per JavaScript/TypeScript
- **TypeScript ESLint 8.3.0**: Plugin ESLint per TypeScript

## 📁 Struttura del Progetto

```
MMG-mockup/
├── src/
│   ├── components/          # Componenti React organizzati per piattaforma
│   │   ├── mmg/            # Componenti piattaforma MMG
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── MMGPlatform.tsx
│   │   │   ├── PDTASelection.tsx
│   │   │   ├── ChatbotPDTA.tsx
│   │   │   ├── Documents.tsx
│   │   │   ├── UsefulLinks.tsx
│   │   │   └── AccessInfo.tsx
│   │   ├── clinici-iov/    # Componenti piattaforma Clinici IOV
│   │   │   ├── CliniciIOV.tsx
│   │   │   ├── CliniciIOVSelector.tsx
│   │   │   ├── medici/     # Area specialisti (oncologi/radioterapisti)
│   │   │   ├── case-manager/ # Area case manager Virginia-Evelina
│   │   │   ├── case-manager-sonia-sabrina/ # Area case manager Sonia-Sabrina
│   │   │   └── ambulatori/ # Aree ambulatori disciplinari
│   │   ├── paziente/       # Componenti piattaforma Paziente
│   │   └── PlatformSelector.tsx # Selettore iniziale piattaforma
│   ├── data/               # Dati statici e mock data
│   │   └── pdtaData.ts
│   ├── types.ts            # Tipi TypeScript globali
│   ├── App.tsx             # Componente root con routing principale
│   ├── main.tsx            # Entry point dell'applicazione
│   └── index.css           # Stili globali
├── dist/                   # Build di produzione (generato)
├── node_modules/           # Dipendenze (generato)
├── index.html              # Template HTML principale
├── package.json            # Configurazione progetto e dipendenze
├── tsconfig.json           # Configurazione TypeScript
├── tsconfig.app.json       # Config TypeScript per app
├── tsconfig.node.json      # Config TypeScript per Node
├── vite.config.ts          # Configurazione Vite
├── tailwind.config.js      # Configurazione Tailwind CSS
├── postcss.config.js       # Configurazione PostCSS
├── eslint.config.js        # Configurazione ESLint
├── COLOR_SCHEME.md         # Documentazione schema colori
└── README.md               # Questo file
```

## 🚀 Installazione

### Prerequisiti
- **Node.js** >= 18.x
- **npm** >= 9.x (o **yarn** / **pnpm**)

### Setup

1. **Clona il repository** (se applicabile) o naviga nella cartella del progetto

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

4. **Apri il browser** su `http://localhost:5173` (o la porta indicata da Vite)

## 📜 Script Disponibili

### `npm run dev`
Avvia il server di sviluppo Vite con hot-reload. L'applicazione sarà disponibile su `http://localhost:5173`.

### `npm run build`
Crea una build di produzione ottimizzata nella cartella `dist/`. La build include:
- Minificazione del codice
- Tree-shaking delle dipendenze non utilizzate
- Ottimizzazione degli asset

### `npm run preview`
Avvia un server locale per visualizzare la build di produzione. Utile per testare la build prima del deploy.

### `npm run lint`
Esegue ESLint per verificare la qualità del codice e individuare potenziali problemi.

### `npm run typecheck`
Esegue il type checking TypeScript senza generare file di output. Utile per verificare errori di tipo.

## 🏗 Architettura

### Routing

Il progetto utilizza **React Router** con routing annidato:

```
/                           → PlatformSelector (selezione piattaforma)
├── /MMG                    → MMGPlatform (piattaforma MMG)
├── /clinici-iov            → CliniciIOVSelector (selezione ruolo)
│   ├── /oncologo-radioterapista → OncologoRadioterapista
│   ├── /case-manager-sonia-sabrina → CaseManagerSoniaSabrina
│   ├── /case-manager-virginia-evelina → CaseManagerVirginiaEvelina
│   ├── /ambulatorio-cure-simultanee → AmbulatorioCureSimultanee
│   ├── /ambulatorio-oncogeriatria → AmbulatorioOncogeriatria
│   └── /ambulatorio-osteoncologia → AmbulatorioOsteoncologia
└── /paziente               → Paziente (piattaforma paziente)
```

### Organizzazione Componenti

Ogni piattaforma ha una struttura modulare con:
- **Header**: Header comune della piattaforma
- **Navbar**: Barra di navigazione tra le sezioni
- **Home**: Pagina principale con menu di navigazione
- **Componenti specifici**: Componenti dedicati alle funzionalità

### State Management

Attualmente il progetto utilizza **React Hooks** (useState) per la gestione dello stato locale. Per funzionalità più complesse, è possibile integrare:
- Context API per stato globale
- Zustand o Redux per state management avanzato
- React Query per gestione dati server

## 🎨 Piattaforme

### 1. MMG (Medici di Medicina Generale)

**Route**: `/MMG`

**Funzionalità principali**:
- **Selezione PDTA**: Verifica requisiti ed esami preliminari per i PDTA
- **Chatbot PDTA**: Assistente AI per valutazione casi clinici e interpretazione PDTA
- **Documenti PDTA**: Visualizzazione e download documenti per ciascun PDTA
- **Link Utili**: Accesso rapido a servizi e risorse per la pratica medica
- **Informazioni Accesso IOV**: Processo di accesso e contatti per l'invio pazienti

### 2. Clinici IOV

**Route**: `/clinici-iov`

**Sottosezioni**:

#### Specialisti (Oncologi/Radioterapisti)
- **Route**: `/clinici-iov/oncologo-radioterapista`
- Gestione richieste, notifiche, prenotazioni e storico visite

#### Case Manager Sonia-Sabrina
- **Route**: `/clinici-iov/case-manager-sonia-sabrina`
- Triage, elenco pazienti

#### Case Manager Virginia-Evelina
- **Route**: `/clinici-iov/case-manager-virginia-evelina`
- Triage, elenco richieste ambulatori, visite ambulatori, visualizzazione paziente

#### Ambulatori Disciplinari
- **Ambulatorio Cure Simultanee**: `/clinici-iov/ambulatorio-cure-simultanee`
- **Ambulatorio Oncogeriatria**: `/clinici-iov/ambulatorio-oncogeriatria`
- **Ambulatorio Osteoncologia**: `/clinici-iov/ambulatorio-osteoncologia`

Ogni ambulatorio gestisce visite giornaliere e richieste specifiche.

### 3. Paziente

**Route**: `/paziente`

Area dedicata ai pazienti (in sviluppo).

## 🎨 Schema Colori

Il progetto utilizza uno schema colori personalizzato basato sul design system IOV, configurato in `tailwind.config.js`.

### Colori Principali

- **Blu Scuro** (`iov-dark-blue`): `#104676` - Header principale
- **Giallo IOV** (`iov-yellow`): `#FFE69C` - Pulsanti e card principali
- **Blu Chiaro** (`iov-light-blue`): `#D9F1FF` - Card servizi
- **Rosa** (`iov-pink`): `#FBE5FF` - Card ricerca e area Clinici IOV
- **Rosso Veneto** (`iov-veneto-red`): `#C8102E` - Logo Regione Veneto
- **Grigi**: Per testi e sfondi secondari

### Gradienti

- **`bg-iov-gradient`**: Gradiente principale (blu chiaro → bianco)
- **`bg-iov-gradient-alt`**: Gradiente alternativo

Per maggiori dettagli, consulta [COLOR_SCHEME.md](./COLOR_SCHEME.md).

### Utilizzo

```tsx
// Esempio utilizzo classi Tailwind personalizzate
<div className="bg-iov-light-blue text-iov-dark-blue-text">
  <button className="bg-iov-yellow hover:bg-iov-yellow-dark">
    Pulsante
  </button>
</div>
```

## 💻 Convenzioni di Sviluppo

### Naming Conventions

- **Componenti**: PascalCase (es. `MMGPlatform.tsx`, `CaseManagerSoniaSabrina.tsx`)
- **File**: PascalCase per componenti, camelCase per utility
- **Variabili/Funzioni**: camelCase
- **Tipi/Interfacce**: PascalCase (es. `Page`, `CliniciIOVStakeholder`)

### Struttura Componenti

Ogni componente principale segue questa struttura:

```tsx
// 1. Import
import { ... } from '...';

// 2. Tipi/Interfacce (se locali)
interface ComponentProps {
  // ...
}

// 3. Componente
function Component({ ... }: ComponentProps) {
  // Hooks
  // State
  // Handlers
  // Render
  return (...);
}

// 4. Export
export default Component;
```

### Organizzazione File

- Ogni cartella di piattaforma contiene i propri componenti
- I tipi condivisi sono in `src/types.ts`
- I tipi specifici di una sezione sono in `types.ts` locale
- I dati mock sono in `src/data/`

### Best Practices

1. **TypeScript**: Utilizzare tipi espliciti per props e state
2. **Componenti**: Mantenere componenti piccoli e focalizzati
3. **Styling**: Utilizzare classi Tailwind, evitare CSS inline quando possibile
4. **Routing**: Utilizzare React Router per navigazione, non window.location
5. **Icons**: Utilizzare Lucide React per consistenza visiva

### Aggiungere una Nuova Funzionalità

1. Creare il componente nella cartella appropriata
2. Aggiungere il tipo di pagina in `types.ts` (se necessario)
3. Aggiungere la route in `App.tsx` o nel router della piattaforma
4. Aggiungere il link nella navbar/menu appropriato
5. Implementare la funzionalità seguendo le convenzioni esistenti

## 📝 Note

- Questo è un progetto **demo/mockup** - alcune funzionalità potrebbero essere simulate
- Supabase è configurato ma non ancora integrato - pronto per integrazione futura
- Il progetto è ottimizzato per sviluppo e produzione con Vite
- La build di produzione è configurata con path relativi (`base: './'`)

## 🤝 Contribuire

Per contribuire al progetto:

1. Seguire le convenzioni di codice esistenti
2. Utilizzare TypeScript per tutti i nuovi componenti
3. Mantenere la coerenza con lo schema colori IOV
4. Testare le modifiche in sviluppo prima di commitare
5. Eseguire `npm run lint` e `npm run typecheck` prima del commit

## 📄 Licenza

[Specificare la licenza se applicabile]

---

**Sviluppato per Istituto Oncologico Veneto (IOV)**
