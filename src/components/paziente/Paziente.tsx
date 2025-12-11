import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Briefcase,
  Car,
  Globe,
  Heart,
  Home,
  ShieldCheck,
  Users,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Monitor,
  HelpCircle,
  TrendingUp,
  Wallet,
  Accessibility,
  Train,
  Sparkles,
  Brain,
  Stethoscope,
  Plane,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

type LucideIconType = typeof ShieldCheck;

const quoteBlocks = [
  {
    title: 'Dichiarazione Universale dei Diritti Umani',
    subtitle: 'ARTICOLO 25, punto 1, adottata dall’Assemblea Generale delle Nazioni Unite il 10 dicembre 1948',
    text: '“Ogni individuo ha diritto ad un tenore di vita sufficiente a garantire la salute e il benessere proprio e della sua famiglia con particolare riguardo all’alimentazione, al vestiario, all’abitazione, alle cure mediche e ai servizi sociali necessari; e ha diritto alla sicurezza in caso di disoccupazione, malattia, invalidità, vedovanza, vecchiaia o in ogni altro caso di perdita dei mezzi di sussistenza per circostanze indipendenti dalla sua volontà.”',
    number: '25'
  },
  {
    title: 'Costituzione della Repubblica Italiana',
    subtitle: 'ARTICOLO 32',
    text: '“La Repubblica tutela la salute come fondamentale diritto dell’individuo e interesse della collettività, e garantisce cure gratuite agli indigenti…”',
    number: '32'
  },
];

interface SectionConfig {
  id: string;
  title: string;
  icon: LucideIconType;
  content: ReactNode;
}

type InfoSectionProps = SectionConfig;

interface NavItem {
  id: string;
  title: string;
  icon: LucideIconType;
}

interface SectionNavButtonProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  variant: 'desktop' | 'mobile';
}

function InfoSection({ id, icon: Icon, title, content }: InfoSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-iov-light-blue-dark/20 p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-iov-light-blue to-iov-light-blue-dark opacity-50"></div>
        <div className="flex items-center gap-4">
          <div className="bg-iov-light-blue-light w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">
            <Icon className="w-7 h-7 text-iov-dark-blue" />
          </div>
          <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">{title}</h2>
        </div>
        <div className="text-iov-gray-text leading-relaxed space-y-6">{content}</div>
      </div>
    </section>
  );
}

function SectionNavButton({ item, isActive, onClick, variant }: SectionNavButtonProps) {
  const Icon = item.icon;

  if (variant === 'desktop') {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-lg group ${isActive
          ? 'bg-iov-light-blue/30 text-iov-dark-blue font-medium border-l-4 border-iov-dark-blue shadow-sm'
          : 'text-iov-gray-text hover:bg-iov-light-blue/10 hover:text-iov-dark-blue border-l-4 border-transparent'
          }`}
      >
        <span className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${isActive ? 'text-iov-dark-blue' : 'text-iov-gray-text/70 group-hover:text-iov-dark-blue'}`} />
          <span>{item.title}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all shadow-sm ${isActive
        ? 'bg-iov-dark-blue text-white border-iov-dark-blue'
        : 'bg-white text-iov-gray-text border-iov-light-blue-dark/30 hover:border-iov-dark-blue/50'
        }`}
    >
      <Icon className="w-4 h-4" />
      {item.title}
    </button>
  );
}

function Paziente() {
  const [activeSection, setActiveSection] = useState<string>('ticket-048');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = useMemo<SectionConfig[]>(
    () => [
      {
        id: 'ticket-048',
        title: 'Esenzione ticket (048)',
        icon: FileText,
        content: (
          <>
            <p>
              La persona a cui è stata diagnosticata una patologia oncologica ha diritto all’esenzione dal pagamento del ticket per farmaci, visite ed esami correlati alla
              patologia, per la riabilitazione e per la prevenzione da ulteriori aggravamenti (decreto ministeriale, 28 maggio 1999, n. 329; decreto ministeriale, 21
              maggio 2001, n°296).
            </p>
            <div className="bg-iov-light-blue-light/50 rounded-xl p-6 border border-iov-light-blue/30">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-iov-light-blue-dark" />
                <h3 className="font-bold text-iov-dark-blue">Come ottenere l’esenzione</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">1</div>
                  <p>Il medico specialista ospedaliero che diagnostica la malattia oncologica compila l’apposito modulo necessario per ottenere l’esenzione del ticket e lo consegna al paziente;</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">2</div>
                  <p>Il paziente consegna il modulo al proprio Distretto Sanitario, insieme alla tessera sanitaria e al codice fiscale;</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">3</div>
                  <p>Il Distretto rilascia un certificato con il relativo numero di esenzione (048).</p>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-iov-dark-blue pl-4 py-3 bg-iov-light-blue/20 rounded-r-lg">
              <p className="text-sm">
                <span className="font-bold text-iov-dark-blue">Durata:</span> Le esenzioni per tumori possono avere durata di 5 o 10 anni dalla data della prima diagnosi, o illimitata. Alla eventuale scadenza, l’esenzione viene confermata
                sulla base dell’ultima certificazione prodotta dalla struttura oncologica di riferimento che ha in cura il paziente.
              </p>
            </div>
          </>
        ),
      },
      {
        id: 'invalidita-civile',
        title: 'Invalidità civile',
        icon: Users,
        content: (
          <>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Invalidità civile</h3>
                </div>
                <p>
                  L’invalidità civile viene espressa come percentuale di riduzione della capacità lavorativa (Legge 118/1971). Questo riconoscimento permette di accedere ai
                  benefici economici, assistenziali e lavorativi previsti dalla legge in maniera diversa in base al grado di invalidità riconosciuto.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-iov-light-blue-dark" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Stato di handicap</h3>
                </div>
                <p>
                  Oltre alla domanda per l’invalidità civile, il paziente oncologico può richiedere all’INPS l’accertamento dello stato di handicap. In base alla Legge 104 del 5
                  febbraio 1992 (Legge-quadro per l’assistenza, l’integrazione sociale e i diritti delle persone handicappate), una volta ottenuto tale riconoscimento, il
                  paziente oncologico può usufruire di alcuni benefici fiscali e di una maggiore tutela in ambito lavorativo.
                </p>
              </div>

              <div className="bg-iov-light-blue-light/50 p-6 rounded-xl border border-iov-light-blue/30">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Collocamento mirato</h3>
                </div>
                <p>
                  Chi ha riconosciuta una invalidità superiore al 45% ha la possibilità di usufruire del cosiddetto COLLOCAMENTO MIRATO, ovvero l’iscrizione nelle
                  liste speciali dei centri per l’impiego ai sensi della legge 68/99. Essendo collocamenti mirati vengono gestiti dalle Regioni e dalle Provincie quindi
                  per maggiori informazioni consultate il sito istituzionale della propria Regione e gli Uffici del Lavoro della Provincia di residenza.
                </p>
              </div>

              <h3 className="text-xl font-bold text-iov-dark-blue pt-4">Come ottenere il riconoscimento di invalidità civile e di stato di handicap</h3>
              <p>
                Ai sensi della Legge 102/2009, dal 1° gennaio 2010 tale domanda va presentata direttamente ed esclusivamente all’INPS secondo una procedura
                telematica unificata, articolata in due fasi:
              </p>
              <div className="space-y-3">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">1</div>
                  <p>Redazione del certificato medico digitale</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">2</div>
                  <p>Presentazione della domanda vera e propria direttamente sul sito dell’INPS o attraverso i soggetti abilitati</p>
                </div>
              </div>

              <div className="border-l-4 border-iov-yellow-dark bg-iov-yellow/10 p-4 rounded-r-lg">
                <p className="text-sm">
                  <span className="font-bold text-iov-dark-blue">Importante:</span> Nella compilazione della domanda, solo se si selezionano contemporaneamente entrambe le voci per il riconoscimento dell’invalidità civile, di stato di
                  handicap ed il collocamento mirato, si può evitare di dover ripetere l’iter per intero per ottenerli.
                </p>
              </div>

              <div className="border-l-4 border-iov-dark-blue bg-iov-light-blue/20 p-4 rounded-r-lg flex gap-3">
                <Clock className="w-5 h-5 text-iov-dark-blue shrink-0 mt-0.5" />
                <p className="text-sm">
                  <span className="font-bold text-iov-dark-blue">Iter accelerato:</span> I cittadini con malattia oncologica in atto hanno diritto ad un iter di valutazione più rapido, che consiste nel diritto all’accertamento entro 15 giorni
                  dalla domanda (Legge 80/2006, “Misure urgenti in materia di organizzazione e funzionamento della pubblica amministrazione”).
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-iov-yellow-text">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-iov-dark-blue">Chi rientra nella definizione di iter accelerato:</h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-iov-gray-text">
                  <li>Una patologia neoplastica di prima diagnosi o recidiva con necessità di trattamento radioterapico o chemioterapico;</li>
                  <li>Una patologia neoplastica metastatizzata in fase avanzata con compromissione delle condizioni generali e indicazione clinica al trattamento palliativo e/o assistenziale.</li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-iov-dark-blue pt-4">Il percorso da seguire</h3>

              <div className="space-y-4">
                <h4 className="text-iov-dark-blue font-bold uppercase">1. OTTENERE IL CERTIFICATO MEDICO</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Bisogna recarsi presso il proprio medico di medicina generale o presso un altro medico certificatore per la compilazione e l’invio telematico all’INPS del certificato. La prestazione è a pagamento;</li>
                  <li>Il medico certificatore consegna all’interessato una copia stampata e firmata del certificato e la ricevuta di trasmissione;</li>
                  <li>L’interessato dovrà esibire questo documento all’atto della visita alla commissione medica preposta.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-iov-dark-blue font-bold uppercase">2. PRESENTAZIONE DELLA DOMANDA</h4>
                <p>
                  La persona interessata deve inoltrare la domanda per via telematica all’INPS. Può operare in modo autonomo oppure avvalersi dell’assistenza di un
                  patronato sindacale (o altri soggetti abilitati in possesso di un PIN). Il completamento della domanda deve avvenire entro 90 giorni dalla data di
                  emissione del certificato medico.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-iov-light-blue-light/50 p-6 rounded-xl border border-iov-light-blue/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-5 h-5 text-iov-dark-blue" />
                    <h4 className="font-bold text-iov-dark-blue">Per chi usa il computer</h4>
                  </div>
                  <p className="text-sm">
                    Si ottiene il PIN per accedere alla compilazione della domanda presso la sede
                    dell’INPS, online attraverso la procedura di richiesta PIN chiamando il numero
                    verde 803 164 (gratuito da rete fissa) oppure 06 164 164 da rete mobile (a
                    pagamento). Una volta ottenuto il PIN “dispositivo”, ci si collega al sito
                    internet dell’INPS (https://www.inps.it) per la compilazione ONLINE della
                    domanda abbinando il numero di certificato indicato sulla ricevuta di
                    trasmissione.
                  </p>
                </div>
                <div className="bg-iov-light-blue-light/50 p-6 rounded-xl border border-iov-light-blue/30">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-iov-light-blue-dark" />
                    <h4 className="font-bold text-iov-dark-blue">Per chi non usa il computer</h4>
                  </div>
                  <p className="text-sm">
                    La domanda, sempre per via telematica, può essere presentata tramite i
                    patronati, le associazioni di categoria o altri soggetti abilitati.
                  </p>
                </div>
              </div>

              <div className="bg-iov-light-blue-light/50 p-6 rounded-xl border border-iov-light-blue/30 space-y-4">
                <h3 className="font-bold text-iov-dark-blue text-lg">La visita medica</h3>
                <p>
                  Ai sensi dell’art. 6 della Legge 80/2006, l’accertamento dell’invalidità civile o dell’handicap riguardanti i soggetti con patologie oncologiche è effettuata dalla
                  Commissione Medica entro 15 giorni dalla domanda dell’interessato. L’invito a presentarsi davanti alla commissione è inviato per posta con lettera raccomandata.
                </p>
                <p>
                  La persona interessata dovrà presentarsi alla data e ora indicata nella lettera, munito di un documento di riconoscimento valido e della documentazione in suo possesso
                  che accerta la diagnosi di tumore. Inoltre, può essere accompagnato ed assistito da un medico di fiducia.
                </p>
                <p>
                  Gli esiti dell’accertamento hanno efficacia immediata per il godimento dei benefici da essa derivanti, fatta salva la facoltà della commissione di sospenderne gli effetti
                  fino all’esito di ulteriori valutazioni. Il verbale definitivo è inviato per posta all’interessato alla conclusione dell’iter sanitario in duplice copia, una per l’interessato
                  completa di dati sensibili sulla propria condizione di salute e una meno dettagliata nel caso voglia usarla per fini lavorativi.
                </p>
              </div>

              <div className="border-l-4 border-iov-light-blue-dark bg-iov-light-blue/10 p-4 rounded-r-lg">
                <p className="text-sm">
                  <span className="font-bold text-iov-dark-blue">Aggravamento:</span> In caso di progressione di malattia l’interessato può richiedere la verifica dell’aggravamento dello stato di salute, seguendo lo stesso iter previsto per la
                  domanda di riconoscimento iniziale, allegando alla domanda la documentazione comprovante l’aggravarsi della patologia.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'benefici-lavoro',
        title: 'Benefici Lavoro',
        icon: Briefcase,
        content: (
          <>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Benefici economici, assistenziali e lavorativi previsti dalla legge</h2>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Accessibility className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Benefici e agevolazioni nella fornitura di ausili e protesi</h3>
                </div>
                <p>
                  Il Servizio Sanitario Nazionale (SSN) fornisce gratuitamente ausili e protesi alle persone con invalidità superiore al 33% e agli altri beneficiari previsti
                  dal decreto del Ministro della Sanità 332/1999 anche se in attesa del riconoscimento di invalidità. Per ulteriori approfondimenti, ci si può rivolgere
                  al distretto dell’ULSS di residenza, Ufficio Protesi e Ausili.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-iov-light-blue-dark" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Benefici e agevolazioni nel lavoro</h3>
                </div>
                <p>
                  Il paziente oncologico che lavora, per curarsi può usufruire di permessi lavorativi retribuiti in base alla percentuale di invalidità, al riconoscimento dello
                  stato di handicap in situazione di gravità, e/o in base al proprio contratto di lavoro. Il riconoscimento dello stato di handicap in situazione di gravità
                  prevede la stessa possibilità di usufruire di permessi lavorativi retribuiti anche per il familiare che accompagna il paziente durante le visite (Legge
                  104/1992). La modalità per accedere ai benefici e agevolazioni varia in base al tipo di contratto di lavoro. Pertanto, si consiglia di informarsi presso il
                  proprio datore di lavoro o patronato.
                </p>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue">Permessi retribuiti per cure</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">1</div>
                    <p>Il lavoratore con il riconoscimento di invalidità civile superiore al 50% dispone di <span className="font-bold">30 giorni all’anno</span>, anche continuativi, per le cure mediche associate allo stato di invalidità (indipendentemente dal riconoscimento di stato di handicap in situazione di gravità). Per fruire di questi permessi occorre presentare la relativa documentazione medica che giustifica l’assenza dal lavoro;</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-iov-dark-blue text-white flex items-center justify-center font-bold shrink-0 shadow-md">2</div>
                    <p>Il lavoratore con handicap in situazione di gravità (Legge 104/1992) dispone di <span className="font-bold">2 ore giornaliere</span> o di <span className="font-bold">3 giorni mensili</span> per curarsi, mentre un familiare dispone di 3 giorni mensili. Per ottenere il permesso, occorre farne richiesta al datore di lavoro e/o al proprio ente di previdenza, in alcuni casi esclusivamente per via telematica;</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-iov-dark-blue bg-iov-light-blue/20 p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue">Terapia salvavita</h3>
                </div>
                <p className="mb-4">
                  Oltre ai benefici previsti sopra esposti, alcuni CCNL del pubblico impiego e, in misura minore, del settore privato prevedono alcuni giorni di assenza dal lavoro per
                  terapia salvavita temporaneamente e/o parzialmente invalidanti (per esempio, la chemioterapia e/o la radioterapia) e i giorni di convalescenza da queste terapie (NB.
                  dipende sempre da contratto di lavoro).
                </p>
                <p className="font-bold text-iov-dark-blue-text">
                  Questi giorni non sono conteggiati come giorni di assenza per malattia e sono interamente retribuiti. <span className="font-normal">Per ottenere il permesso per sottoporsi a terapie salvavita è
                    necessario specificare il motivo dell’assenza per la quale il datore di lavoro può richiedere idonea certificazione medica.</span>
                </p>
              </div>
            </div>
          </>
        )
      },
      {
        id: 'benefici-economici',
        title: 'Benefici Economici',
        icon: Wallet,
        content: (
          <>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Benefici socio-economici</h2>
              <p>
                Il paziente oncologico in base al grado di invalidità riconosciuto e al reddito potrebbe avere diritto ad un sostegno economico dall’INPS. L’iter prevede
                una verifica dei dati socio-economici e reddituali trasmessi telematicamente dal cittadino dopo il ricevimento del verbale della commissione.
              </p>

              <div className="border-l-4 border-iov-yellow-dark bg-iov-yellow/10 p-4 rounded-r-lg">
                <p className="text-sm">
                  <span className="font-bold text-iov-dark-blue">Nota:</span> Tutti gli importi, soglie del reddito e le erogazioni mensili vengono stabiliti annualmente per legge. L’età lavorativa è suscettibile di variazione in relazione alla
                  revisione periodica, da parte del Governo, dell’età pensionabile in relazione alle aspettative di vita.
                </p>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Invalidità civile parziale (≥74%)</h3>
                </div>
                <p>
                  Una persona in età lavorativa (da 18 a 66 anni e sette mesi*) ha diritto all’<span className="font-bold">assegno mensile di invalidità</span> e all’<span className="font-bold">esenzione dal ticket</span> per farmaci (che varia
                  fra le Regioni) e prestazioni sanitarie (cod. C03).
                </p>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-iov-light-blue-dark" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Invalidità civile totale (100%)</h3>
                </div>
                <p>
                  Una persona in età lavorativa (da 18 a 66 anni e sette mesi*) può avere diritto alla <span className="font-bold">pensione di inabilità</span> (invalidi totali) e all’<span className="font-bold">esenzione dal ticket</span> per farmaci (che varia
                  fra le Regioni) e prestazioni sanitarie (cod. C01).
                </p>
              </div>

              <div className="bg-iov-light-blue-light/50 border-l-4 border-iov-dark-blue p-6 rounded-r-lg">
                <h3 className="font-bold text-iov-dark-blue text-lg mb-2">Indennità di accompagnamento</h3>
                <p>
                  L’indennità di accompagnamento viene riconosciuta ai invalidi totali per i quali è stata accertata l’impossibilità di deambulare senza l’aiuto di un accompagnatore
                  oppure l’incapacità di compiere gli atti quotidiani della vita.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'mobilita',
        title: 'Mobilità',
        icon: Car,
        content: (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-iov-light-blue flex items-center justify-center">
                  <Car className="w-6 h-6 text-iov-dark-blue" />
                </div>
                <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Benefici per la mobilità</h2>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Benefici e agevolazioni in auto</h3>
                </div>
                <p className="mb-4">
                  Il malato con problemi di deambulazione ha diritto ad alcune agevolazioni. Una tra queste è il <span className="font-bold">contrassegno per disabili</span>, rilasciato dal comune di
                  residenza, che permette:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-iov-gray-text">
                  <li>Il libero transito nelle zone a traffico limitato e nelle zone pedonali</li>
                  <li>Il parcheggio gratuito negli appositi spazi individuati dal simbolo di portatore di handicap</li>
                  <li>La sosta senza limitazioni di tempo nelle aree di parcheggio a tempo determinato</li>
                </ul>
              </div>

              <div className="bg-iov-light-blue-light/50 p-6 rounded-xl border border-iov-light-blue/30">
                <p className="text-iov-gray-text">
                  <span className="font-bold text-iov-dark-blue">Il contrassegno è nominale</span> e può essere utilizzato solo quando l’auto è al servizio del malato.
                </p>
                <p className="mt-4 text-iov-gray-text text-sm">
                  La domanda per il rilascio del contrassegno deve essere presentata all’ufficio della polizia locale del proprio comune di residenza, compilando l’apposito modulo e
                  presentando il certificato di invalidità civile oppure il certificato medico-legale dell’Azienda ULSS che attesta la compromissione della capacità di deambulazione.
                </p>
              </div>

              <div className="border-l-4 border-iov-light-blue-dark bg-iov-light-blue/10 p-4 rounded-r-lg">
                <p className="text-sm">
                  Nel caso non sia indicato nel verbale di invalidità che ci sono persistenti difficoltà nella deambulazione (Art. 381 Regolamento di attuazione del codice stradale), ci si può
                  rivolgere all’ambulatorio di Sanità Pubblica della propria AULSS per verificare se le limitazioni fisiche sono tali da consentire il rilascio del certificato medico per ottenere
                  questa agevolazione.
                </p>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Benefici e agevolazioni in autobus</h3>
                </div>
                <p>
                  Il malato oncologico può beneficiare di agevolazioni per l’uso di mezzi di trasporto pubblico. La tipologia delle stesse può dipendere dalla percentuale di invalidità e dal
                  reddito. Per ulteriori informazioni, ci si può rivolgere all’URP del proprio comune o all’ente di riferimento.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Train className="w-5 h-5 text-iov-light-blue-dark" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Benefici e agevolazioni in treno</h3>
                </div>
                <p className="mb-4">
                  Le ferrovie dello Stato rilasciano la <span className="font-bold">Carta Blu</span> agli invalidi civili residenti in Italia titolari dell’indennità di accompagnamento (di cui alla Legge 18/80 e
                  s.m.i.) e ai titolari dell’indennità di comunicazione (di cui alla Legge 381/70).
                </p>
                <div className="bg-iov-light-blue-light/50 p-6 rounded-xl border border-iov-light-blue/30">
                  <p className="mb-4">
                    Tale carta consente al cittadino di <span className="font-bold">circolare sui treni con un accompagnatore pagando un unico biglietto</span>. La Carta Blu viene rilasciata a titolo gratuito presso gli
                    Uffici Assistenza o direttamente nelle stazioni ferroviarie.
                  </p>
                  <p>
                    La validità della carta è quinquennale, pur risultando dipendente dall’attestazione di invalidità ottenuta dal cittadino: qualora l’invalidità sia stata dichiarata revisionabile,
                    la validità della carta è pari a quella riportata nella certificazione di inabilità.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Trasporto alle terapie</h3>
                </div>
                <p>
                  In caso di difficoltà a recarsi all’ospedale nel quale vengono erogate le cure, il paziente può informarsi presso la propria ULSS di competenza o presso il Comune di
                  residenza per conoscere i servizi attivati per il trasporto da casa ai centri sanitari sul territorio.
                </p>
              </div>

              <div className="border-l-4 border-iov-dark-blue bg-iov-light-blue/20 p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Esonero cintura di sicurezza in auto</h3>
                </div>
                <p>
                  È possibile che le terapie oncologiche rendano difficile l’uso della cintura di sicurezza in automobile, specialmente per chi ha subito un intervento chirurgico. Per
                  ottenere l’esonero dall’obbligo delle cinture di sicurezza, è necessario recarsi presso l’Ufficio Igiene e Sanità Pubblica di appartenenza portando una carta che certifichi
                  l’avvenuto intervento chirurgico e/o che attesti eventuali ulteriori problematiche.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'parrucche',
        title: 'Parrucche',
        icon: Sparkles,
        content: (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-iov-dark-blue" />
                <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Agevolazione nell'acquisto di parrucche</h2>
              </div>
              <p>
                La perdita di capelli è un effetto collaterale della chemioterapia che può avere un impatto sull’autostima della persona. Per questo motivo, la spesa
                sostenuta per l’acquisto di una parrucca da parte del paziente oncologico sottoposto a trattamento chemioterapico rientra tra le <span className="font-bold">spese sanitarie
                  detraibili</span>.
              </p>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue">Documenti necessari per la detraibilità</h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-iov-gray-text">
                  <li>Il documento fiscale che attesti l’acquisto della parrucca, dove devono essere riportati sia la voce “vendita parrucca” che il codice fiscale della persona sottoposta a cura chemioterapica;</li>
                  <li>La documentazione medico-sanitaria che attesti il tipo di cura effettuato dalla persona che richiede la detraibilità della parrucca (necessaria anche per richiedere l’IVA agevolata al 4% al momento dell’acquisto).</li>
                </ul>
              </div>

              <div className="border-l-4 border-iov-light-blue-dark bg-iov-light-blue/10 p-6 rounded-r-lg">
                <h3 className="font-bold text-iov-dark-blue text-lg mb-2">Progetto "Non smettere di piacerti"</h3>
                <p className="mb-4 text-sm">
                  Lo IOV ha avviato dal 2009 il progetto “Non smettere di piacerti” in collaborazione con AVO (Associazione Volontari Ospedalieri). Tale progetto mira a supportare le
                  pazienti che affrontano il problema della caduta dei capelli in seguito a chemioterapia, offrendo su richiesta, un <span className="font-bold">servizio gratuito di prestito parrucche</span>. Una volta al
                  mese un acconciatore mette a disposizione le sue competenze per consigliare la parrucca più adatta.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-iov-dark-blue-text">
                  <span className="text-iov-dark-blue">📞</span>
                  Per informazioni: volontari AVO al piano rialzato dello IOV, dal lunedì al venerdì, ore 9.00-12.00, oppure tel. <span className="font-bold">049-8215669</span>
                </div>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'supporto-psicologico',
        title: 'Supporto Psicologico',
        icon: Brain,
        content: (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-iov-dark-blue" />
                <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Supporto psicologico</h2>
              </div>
              <p>
                Il paziente oncologico e/o un suo familiare hanno diritto ad un supporto psicologico. Presso lo IOV si può accedere alle prestazioni dell’UOSD Psicologia
                Ospedaliera con un’impegnativa redatta dal medico specialista di riferimento.
              </p>
              <div className="border-l-4 border-iov-dark-blue bg-iov-light-blue/20 p-4 rounded-r-lg">
                <p className="text-sm">
                  <span className="font-bold text-iov-dark-blue">Nota:</span> Le prestazioni sono esenti dal ticket per i pazienti, come previsto dalla normativa, mentre per i familiari e gli altri utenti sono soggette a pagamento del ticket.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'assistenza-domiciliare',
        title: 'Assistenza Domiciliare',
        icon: Home,
        content: (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-6 h-6 text-iov-dark-blue" />
                <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Assistenza domiciliare</h2>
              </div>
              <p>
                Qualora il malato necessiti di cure specialistiche, infermieristiche, riabilitative, socio-assistenziali o cure palliative può beneficiare dei servizi erogati
                dall’ULSS e dal Comune di residenza, organizzate sotto il nome di <span className="font-bold">Assistenza Domiciliare Integrata</span>. Tale assistenza può essere di due tipi:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-5 h-5 text-iov-dark-blue" />
                    <h3 className="font-bold text-iov-dark-blue">ADI Semplice</h3>
                  </div>
                  <p className="text-sm mb-4">
                    Destinata a persone <span className="font-bold">parzialmente autosufficienti</span> e consiste
                    prevalentemente in attività di tipo infermieristico e/o riabilitativo.
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Come richiederla:</span> Il malato e/o un familiare deve rivolgersi al proprio medico
                    di medicina generale che, valutata la situazione, farà una segnalazione
                    all’ULSS per l’attivazione dei servizi.
                  </p>
                </div>
                <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-5 h-5 text-iov-light-blue-dark" />
                    <h3 className="font-bold text-iov-dark-blue">ADI Complessa</h3>
                  </div>
                  <p className="text-sm mb-4">
                    Destinata a persone <span className="font-bold">non autosufficienti</span> e prevede l’erogazione di
                    prestazioni mediche, infermieristiche, riabilitative e, assistenziali complesse e
                    cure palliative.
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Come richiederla:</span> L’attivazione del servizio avviene sempre tramite richiesta
                    all’ULSS da parte del medico di medicina generale, del malato e/o familiari o
                    degli operatori dei servizi sociali del Comune.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-iov-dark-blue bg-iov-light-blue/20 p-6 rounded-r-lg">
                <p className="text-sm">
                  <span className="font-bold text-iov-dark-blue">Servizio IOV:</span> Presso lo IOV, un gruppo multidisciplinare provvede a valutare la fragilità del paziente afferente alla struttura e, se opportuno, attiva la presa in carico
                  contattando il Distretto Sanitario di appartenenza e il medico famiglia, per garantire una continuità di assistenziale tra l’ospedale e il territorio.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'assistenza-estero',
        title: 'Assistenza Estero',
        icon: Plane,
        content: (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-iov-dark-blue" />
                <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Assistenza Sanitaria all'Estero</h2>
              </div>
              <p>
                L’assistenza sanitaria all’estero è consentita, in via di eccezione e dietro adeguata richiesta, solo presso centri di altissima specializzazione per prestazioni
                di diagnosi, cura e riabilitazione che <span className="font-bold">non sono ottenibili in Italia in modo adeguato o tempestivo</span>.
              </p>

              <div className="bg-iov-light-blue-light/50 rounded-xl p-6 border border-iov-light-blue/30">
                <h3 className="font-bold text-iov-dark-blue mb-4">Per ulteriori informazioni contattare:</h3>
                <p className="mb-4 text-sm text-iov-gray-text">L’ufficio della propria Distretto Sanitario dell’ULSS che si occupa di assistenza sanitaria all’estero;</p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-iov-dark-blue-text">Il Punto di Contatto Regionale del Veneto <span className="font-normal text-iov-gray-text">per l’assistenza sanitaria transfrontaliera:</span></p>
                  <div className="flex items-center gap-2 text-iov-gray-text">
                    <span className="text-iov-dark-blue">📞</span>
                    Numero verde <span className="font-bold">800 310640</span> (dal lunedì al venerdì, ore 9.00-14.00)
                  </div>
                  <div className="flex items-center gap-2 text-iov-gray-text">
                    <span className="text-iov-dark-blue">✉️</span>
                    Email: <a href="mailto:puntocontattoregionale@aopd.veneto.it" className="text-iov-dark-blue hover:underline">puntocontattoregionale@aopd.veneto.it</a>
                  </div>
                </div>
                <p className="mt-4 text-xs text-iov-gray-text/70">Indicare: dati anagrafici, ULSS di appartenenza, sintesi della richiesta e numero di telefono per essere ricontattati.</p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: 'stranieri',
        title: 'Per Stranieri',
        icon: Globe,
        content: (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-iov-dark-blue" />
                <h2 className="text-2xl font-bold text-iov-dark-blue font-serif">Per gli stranieri</h2>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Cittadini della Comunità Europea</h3>
                </div>
                <p className="text-iov-gray-text">
                  Ai cittadini che appartengono alla Comunità europea residenti o domiciliati in Italia in possesso di tessera sanitaria TEAM, il paese UE di residenza rimborsa la
                  prestazione al SSN italiano.
                </p>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-iov-light-blue-dark" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Cittadini extracomunitari con permesso di soggiorno</h3>
                </div>
                <p className="text-iov-gray-text">
                  Ai cittadini che non appartengono alla Comunità europea (extracomunitari), a seconda di condizioni specificate, è garantito il diritto all’<span className="font-bold">iscrizione obbligatoria al
                    Servizio Sanitario Nazionale (SSN)</span> qualora in possesso di regolare permesso di soggiorno o all’<span className="font-bold">iscrizione volontaria al SSN</span>, previo versamento del contributo
                  previsto, che varia in base al reddito percepito o allo status qualora non decidano di stipulare un’assicurazione contro il rischio di infortunio, malattia e maternità con un
                  Istituto assicurativo italiano o straniero.
                </p>
              </div>

              <div className="bg-white border border-iov-light-blue-dark/20 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Extracomunitari regolarmente soggiornanti ma non iscritti al SSN</h3>
                </div>
                <p className="text-iov-gray-text">
                  Ai cittadini extracomunitari regolarmente soggiornanti nel territorio nazionale, ma non iscritti al SSN sono assicurate, <span className="font-bold">a pagamento</span>, le prestazioni sanitarie
                  programmate e le prestazioni ospedaliere urgenti (ambulatoriali, in regime di ricovero o di Day Hospital).
                </p>
              </div>

              <div className="border-l-4 border-iov-dark-blue bg-iov-light-blue/20 p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-iov-dark-blue" />
                  <h3 className="font-bold text-iov-dark-blue text-lg">Cittadini stranieri extracomunitari senza permesso di soggiorno</h3>
                </div>
                <p className="mb-4 text-iov-gray-text">
                  Ai cittadini stranieri extracomunitari senza permesso di soggiorno e indigenti è richiesta la <span className="font-bold">tessera STP (Straniero Temporaneamente Presente)</span> da richiedere presso
                  gli sportelli amministrativi del Distretto Sanitario di riferimento dove si autocertifica l’indigenza.
                </p>
                <p className="text-iov-gray-text">
                  La persona con tessera STP paga il ticket per le prestazioni specialistiche prescritte, <span className="font-bold">non ha diritto a esenzioni per reddito</span> e ha diritto all’<span className="font-bold">esenzione per patologia</span>
                  presentando il certificato di patologia (rilasciato da uno specialista pubblico).
                </p>
              </div>
            </div>
          </>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-20% 0px -60% 0px',
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleNavClick = (id: string) => {
    const sectionEl = document.getElementById(id);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-iov-gradient relative font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-8">
            <div className="bg-white rounded-xl shadow-lg border border-iov-light-blue-dark/20 p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-iov-dark-blue p-2 rounded-lg shadow-md">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-serif font-bold text-iov-dark-blue leading-tight">Diritti del Malato</h1>
                  <p className="text-xs uppercase tracking-wider text-iov-gray-text/70">ONCOLOGICO</p>
                </div>
              </div>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <SectionNavButton
                    key={section.id}
                    item={section}
                    isActive={activeSection === section.id}
                    onClick={() => handleNavClick(section.id)}
                    variant="desktop"
                  />
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Nav */}
          <div className="lg:hidden sticky top-4 z-20 mb-6">
            <div className="bg-white/95 backdrop-blur rounded-xl border border-iov-light-blue-dark/20 shadow-lg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-iov-dark-blue p-1.5 rounded-lg shadow-sm">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif font-bold text-iov-dark-blue">Diritti del Malato</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-iov-dark-blue hover:bg-iov-light-blue/20 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-xl shadow-xl border border-iov-light-blue-dark/20 p-2 max-h-[70vh] overflow-y-auto z-30 animate-in slide-in-from-top-2 duration-200">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={`mobile-${section.id}`}
                      onClick={() => {
                        handleNavClick(section.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${activeSection === section.id
                        ? 'bg-iov-light-blue/30 text-iov-dark-blue font-medium'
                        : 'text-iov-gray-text hover:bg-iov-light-blue/10'
                        }`}
                    >
                      <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-iov-dark-blue' : 'text-iov-gray-text/70'}`} />
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Title Section */}
            <div className="text-center space-y-2 py-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-iov-dark-blue to-iov-light-blue-dark pb-2">
                I Diritti del Malato
                <br />
                Oncologico
              </h1>
            </div>

            {/* Quote Cards */}
            <div className="grid gap-6">
              {quoteBlocks.map((quote, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-iov-light-blue-dark/20 p-6 md:p-8 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm bg-iov-light-blue-light text-iov-dark-blue">
                    {quote.number}
                  </div>
                  <p className="text-iov-gray-text italic text-lg leading-relaxed mb-6 pr-12">
                    {quote.text}
                  </p>
                  <div>
                    <h3 className="font-bold text-iov-dark-blue">
                      {quote.title}
                    </h3>
                    <p className="text-xs text-iov-gray-text/60 uppercase tracking-wider mt-1">{quote.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Intro Card */}
            <div className="bg-white rounded-xl shadow-lg border border-iov-light-blue-dark/20 p-6 md:p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-iov-dark-blue"></div>
              <div className="flex items-start gap-6">
                <div className="hidden md:flex bg-iov-light-blue-light w-16 h-16 rounded-xl items-center justify-center shrink-0 shadow-sm">
                  <Info className="w-8 h-8 text-iov-dark-blue" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-iov-dark-blue font-serif mb-4">La diagnosi di malattia oncologica</h2>
                  <p className="text-iov-gray-text leading-relaxed text-lg">
                    La diagnosi di malattia oncologica rappresenta uno degli eventi più stressanti nel corso della vita. In
                    generale, tutti i cittadini regolarmente iscritti al Servizio Sanitario Nazionale (SSN), possono usufruire dei
                    diritti descritti nella presente guida, volti a tutelare il paziente oncologico.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section) => (
                <InfoSection key={section.id} {...section} />
              ))}
            </div>

            {/* Footer */}
            <div className="bg-iov-dark-blue rounded-xl p-12 text-center text-white space-y-8 shadow-xl">
              <p className="italic text-blue-100 max-w-3xl mx-auto">
                Il materiale informativo è stato valutato, per chiarezza e comprensibilità, da rappresentanti di pazienti, familiari e componenti di associazioni di volontariato
              </p>

              <h2 className="text-4xl font-serif font-bold">La cura è nella ricerca.</h2>

              <div className="space-y-4">
                <p className="text-blue-100">Può sostenere l'Istituto Oncologico Veneto con una donazione:</p>
                <ul className="text-blue-100 space-y-2">
                  <li>• Tramite bonifico</li>
                  <li>• Tramite piattaforma PagoPA</li>
                  <li>• Devolvendo il 5 per mille (C.F. 04074560287)</li>
                </ul>
              </div>

              <a
                href="https://www.ioveneto.it/sostienici"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-iov-yellow hover:bg-iov-yellow-dark text-iov-yellow-text px-8 py-4 rounded-full font-bold transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
              >
                Scopri come donare
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Paziente;
