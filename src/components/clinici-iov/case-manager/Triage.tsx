import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle2, User, Phone, Mail, MapPin, FileText, ClipboardList, AlertCircle } from 'lucide-react';
import { pdtaData } from '../../../data/pdtaData';
import { DatiAnagrafici, CareGiver, MMG } from './types';

interface TriageProps {
  onBack: () => void;
}

// Funzione mock per validare e caricare dati anagrafici
const validateCodiceFiscale = (cf: string): boolean => {
  return cf.length === 16;
};

// Mock data generator
const generateMockAnagrafica = (codiceFiscale: string): DatiAnagrafici => {
  const nomi = ['Mario', 'Giovanna', 'Luigi', 'Anna', 'Paolo', 'Maria'];
  const cognomi = ['Rossi', 'Bianchi', 'Verdi', 'Neri', 'Gialli', 'Blu'];
  const comuni = ['Padova', 'Venezia', 'Vicenza', 'Verona', 'Treviso'];
  const index = Math.abs(codiceFiscale.charCodeAt(0)) % nomi.length;
  
  return {
    codiceFiscale,
    nome: nomi[index],
    cognome: cognomi[index],
    dataNascita: '01-01-1980',
    residenza: `${comuni[index]}, Via Roma 1`,
    telefono: `+39 3${Math.floor(Math.random() * 90000000) + 10000000}`,
    mail: `${nomi[index].toLowerCase()}.${cognomi[index].toLowerCase()}@email.it`,
  };
};

const generateMockCareGiver = (): CareGiver => {
  return {
    nome: 'Giuseppe',
    cognome: 'Rossi',
    mail: 'giuseppe.rossi@email.it',
    telefono: '+39 333 1234567',
  };
};

const generateMockMMG = (): MMG => {
  return {
    nome: 'Dr. Marco',
    cognome: 'Bianchi',
    comuneRiferimento: 'Padova',
    mail: 'marco.bianchi@mmg.it',
    telefono: '+39 049 1234567',
  };
};

function Triage({ onBack }: TriageProps) {
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [datiAnagrafici, setDatiAnagrafici] = useState<DatiAnagrafici | null>(null);
  const [careGiver, setCareGiver] = useState<CareGiver | null>(null);
  const [mmg, setMmg] = useState<MMG | null>(null);
  const [impegnativaFileName, setImpegnativaFileName] = useState('');
  const [pdtaSelezionato, setPdtaSelezionato] = useState<string>('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [triageCompletato, setTriageCompletato] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Carica dati quando CF è valido
  useEffect(() => {
    if (codiceFiscale && validateCodiceFiscale(codiceFiscale)) {
      const anagrafica = generateMockAnagrafica(codiceFiscale);
      setDatiAnagrafici(anagrafica);
      setCareGiver(generateMockCareGiver());
      setMmg(generateMockMMG());
      setErrors(prev => ({ ...prev, codiceFiscale: '' }));
    } else if (codiceFiscale && codiceFiscale.length > 0) {
      setErrors(prev => ({ ...prev, codiceFiscale: 'Il codice fiscale deve essere esattamente 16 caratteri' }));
      setDatiAnagrafici(null);
      setCareGiver(null);
      setMmg(null);
    }
  }, [codiceFiscale]);

  // Inizializza checklist quando PDTA viene selezionato
  useEffect(() => {
    if (pdtaSelezionato) {
      const selectedPdta = pdtaData.find(p => p.id === pdtaSelezionato);
      if (selectedPdta) {
        const newChecklist: Record<string, boolean> = {};
        selectedPdta.exams.forEach(exam => {
          newChecklist[exam] = false;
        });
        setChecklist(newChecklist);
      }
    } else {
      setChecklist({});
    }
  }, [pdtaSelezionato]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setImpegnativaFileName(file.name);
      setErrors(prev => ({ ...prev, impegnativaFile: '' }));
    } else {
      setErrors(prev => ({ ...prev, impegnativaFile: 'Seleziona un file PDF' }));
    }
  };

  const handleChecklistChange = (exam: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [exam]: checked }));
  };

  const handleConferma = () => {
    const newErrors: Record<string, string> = {};

    if (!codiceFiscale || !validateCodiceFiscale(codiceFiscale)) {
      newErrors.codiceFiscale = 'Codice fiscale obbligatorio';
    }
    if (!impegnativaFileName) {
      newErrors.impegnativaFile = 'Allegare impegnativa PDF obbligatorio';
    }
    if (!pdtaSelezionato) {
      newErrors.pdta = 'Selezionare PDTA obbligatorio';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowReview(true);
  };

  const handleReviewConfirm = () => {
    setShowReview(false);
    setTriageCompletato(true);
  };

  const handleReviewBack = () => {
    setShowReview(false);
  };

  if (triageCompletato) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna alla Home
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-iov-gray-text mb-4">Triage Completato</h2>
            <p className="text-gray-600 mb-8">Il triage del paziente è stato completato con successo.</p>
            <button
              onClick={() => {
                setTriageCompletato(false);
                setCodiceFiscale('');
                setDatiAnagrafici(null);
                setCareGiver(null);
                setMmg(null);
                setImpegnativaFileName('');
                setPdtaSelezionato('');
                setChecklist({});
                setNote('');
                setErrors({});
                setShowReview(false);
              }}
              className="bg-iov-dark-blue hover:bg-iov-dark-blue-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Nuovo Triage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showReview && datiAnagrafici && careGiver && mmg) {
    const selectedPdta = pdtaData.find((pdta) => pdta.id === pdtaSelezionato);
    const checklistCompletata = Object.entries(checklist).filter(([, checked]) => checked);

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleReviewBack}
          className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Torna alla compilazione
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-iov-gray-text mb-2">Verifica dati triage</h2>
            <p className="text-gray-500">Controlla le informazioni inserite prima di procedere con la conferma definitiva.</p>
          </div>

          <div className="grid gap-6">
            <section className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-iov-dark-blue" />
                <h3 className="text-xl font-semibold text-iov-gray-text">Paziente</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="uppercase text-gray-400 text-xs font-semibold">Codice Fiscale</p>
                  <p className="font-semibold font-mono text-base text-iov-gray-text">{datiAnagrafici.codiceFiscale}</p>
                </div>
                <div>
                  <p className="uppercase text-gray-400 text-xs font-semibold">Nome e Cognome</p>
                  <p className="font-semibold text-base text-iov-gray-text">{datiAnagrafici.nome} {datiAnagrafici.cognome}</p>
                </div>
                <div>
                  <p className="uppercase text-gray-400 text-xs font-semibold">Data di nascita</p>
                  <p className="font-semibold text-base text-iov-gray-text">{datiAnagrafici.dataNascita}</p>
                </div>
                <div>
                  <p className="uppercase text-gray-400 text-xs font-semibold">Residenza</p>
                  <p className="font-semibold text-base text-iov-gray-text">{datiAnagrafici.residenza}</p>
                </div>
                <div>
                  <p className="uppercase text-gray-400 text-xs font-semibold">Contatti</p>
                  <p className="font-semibold text-base text-iov-gray-text">{datiAnagrafici.telefono} • {datiAnagrafici.mail}</p>
                </div>
              </div>
            </section>

            <section className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-iov-gray-text">Care Giver</h3>
              </div>
              <p className="text-sm text-gray-600">
                {careGiver.nome} {careGiver.cognome} • {careGiver.telefono} • {careGiver.mail}
              </p>
            </section>

            <section className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-iov-gray-text">Medico di Medicina Generale</h3>
              </div>
              <p className="text-sm text-gray-600">
                {mmg.nome} {mmg.cognome} • {mmg.comuneRiferimento} • {mmg.telefono} • {mmg.mail}
              </p>
            </section>

            <section className="border border-gray-200 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-iov-dark-blue" />
                <h3 className="text-xl font-semibold text-iov-gray-text">Dettagli triage</h3>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-iov-gray-text">PDTA selezionato:</span> {selectedPdta ? selectedPdta.name : 'Non indicato'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-iov-gray-text">Impegnativa:</span> {impegnativaFileName || 'Non caricata'}
              </p>
              <div>
                <p className="text-sm font-semibold text-iov-gray-text mb-1">Checklist visite completate</p>
                {checklistCompletata.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {checklistCompletata.map(([exam]) => (
                      <li key={exam}>{exam}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Nessuna visita selezionata</p>
                )}
              </div>
              {note && (
                <div>
                  <p className="text-sm font-semibold text-iov-gray-text mb-1">Note</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{note}</p>
                </div>
              )}
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleReviewBack}
              className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-semibold transition-all"
            >
              Modifica dati
            </button>
            <button
              type="button"
              onClick={handleReviewConfirm}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-iov-dark-blue to-iov-dark-blue-hover text-white font-semibold shadow hover:shadow-lg transition-all"
            >
              Conferma e completa il triage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <form className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 pb-6 border-b-2 border-iov-light-blue">
          <h2 className="text-3xl font-bold text-iov-gray-text flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-iov-dark-blue" />
            Triage Paziente
          </h2>
          <p className="text-gray-500 text-sm mt-2">Inserisci il codice fiscale del paziente per iniziare il triage</p>
        </div>

        {/* Codice Fiscale */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-iov-light-blue-light flex items-center justify-center">
              <User className="w-5 h-5 text-iov-dark-blue" />
            </div>
            <h3 className="text-xl font-bold text-iov-gray-text">Codice Fiscale</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-iov-gray-text mb-2">
              Codice Fiscale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={codiceFiscale}
              onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())}
              maxLength={16}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all font-mono ${
                errors.codiceFiscale ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
              }`}
              placeholder="Inserisci codice fiscale (16 caratteri)"
            />
            {errors.codiceFiscale && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.codiceFiscale}
              </p>
            )}
          </div>
        </div>

        {/* Dati Anagrafici */}
        {datiAnagrafici && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-iov-light-blue-light flex items-center justify-center">
                <User className="w-5 h-5 text-iov-dark-blue" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Dati Anagrafici Paziente</h3>
            </div>

            <div className="bg-gradient-to-br from-iov-light-blue-light to-white rounded-xl p-6 border-2 border-iov-light-blue shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Codice Fiscale</label>
                  <p className="text-base font-semibold text-iov-gray-text font-mono">{datiAnagrafici.codiceFiscale}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiAnagrafici.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiAnagrafici.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Data di Nascita
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiAnagrafici.dataNascita}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Residenza
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiAnagrafici.residenza}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefono
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiAnagrafici.telefono}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiAnagrafici.mail}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Care Giver */}
        {careGiver && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Informazioni Care Giver</h3>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{careGiver.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{careGiver.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{careGiver.mail}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefono
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{careGiver.telefono}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MMG */}
        {mmg && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Informazioni MMG</h3>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-200 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{mmg.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{mmg.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Comune di Riferimento
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{mmg.comuneRiferimento}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{mmg.mail}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefono
                  </label>
                  <p className="text-base font-semibold text-iov-gray-text">{mmg.telefono}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Impegnativa */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-iov-light-blue-light flex items-center justify-center">
              <FileText className="w-5 h-5 text-iov-dark-blue" />
            </div>
            <h3 className="text-xl font-bold text-iov-gray-text">Impegnativa</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-iov-gray-text mb-2">
              Upload PDF Impegnativa <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-iov-dark-blue to-iov-dark-blue-hover text-white rounded-lg cursor-pointer hover:shadow-lg transition-all font-medium">
                <Upload className="w-5 h-5" />
                <span>Carica PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {impegnativaFileName && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{impegnativaFileName}</span>
                </div>
              )}
            </div>
            {errors.impegnativaFile && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.impegnativaFile}
              </p>
            )}
          </div>
        </div>

        {/* Selezione PDTA */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-iov-light-blue-light flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-iov-dark-blue" />
            </div>
            <h3 className="text-xl font-bold text-iov-gray-text">PDTA di Riferimento</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-iov-gray-text mb-3">
              Seleziona PDTA <span className="text-red-500">*</span>
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {pdtaData.map((pdta) => (
                <button
                  key={pdta.id}
                  type="button"
                  onClick={() => setPdtaSelezionato(pdta.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    pdtaSelezionato === pdta.id
                      ? 'border-iov-dark-blue bg-iov-light-blue-light'
                      : 'border-gray-200 hover:border-iov-light-blue bg-white'
                  }`}
                >
                  <h4 className="font-semibold text-iov-gray-text">{pdta.name}</h4>
                </button>
              ))}
            </div>
            {errors.pdta && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.pdta}
              </p>
            )}
          </div>
        </div>

        {/* Checklist */}
        {pdtaSelezionato && Object.keys(checklist).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Checklist Visite</h3>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-4">Spunta le visite già effettuate dal paziente:</p>
              <div className="space-y-3">
                {Object.keys(checklist).map((exam) => (
                  <label
                    key={exam}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[exam]}
                      onChange={(e) => handleChecklistChange(exam, e.target.checked)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                    />
                    <span className="text-iov-gray-text font-medium">{exam}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-iov-gray-text">Note</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-iov-gray-text mb-2">
              Note aggiuntive (opzionale)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all resize-none hover:border-iov-dark-blue"
              placeholder="Inserisci eventuali note aggiuntive..."
            />
          </div>
        </div>

        {/* Pulsante Conferma */}
        <div className="border-t-2 border-iov-light-blue pt-6 mt-8">
          <button
            type="button"
            onClick={handleConferma}
            className="w-full sm:w-auto bg-gradient-to-r from-iov-dark-blue to-iov-dark-blue-hover hover:shadow-lg text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold text-base"
          >
            Conferma Triage
          </button>
        </div>
      </form>
    </div>
  );
}

export default Triage;

