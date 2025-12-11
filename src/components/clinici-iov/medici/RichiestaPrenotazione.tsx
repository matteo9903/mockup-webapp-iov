import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Send, User, FileText, Stethoscope, Calendar, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import { Ambulatorio, PDTA, type RichiestaPrenotazione } from './types';

interface RichiestaPrenotazioneProps {
  onBack: () => void;
}

// Funzione per validare codice fiscale (demo - semplificata)
const validateCodiceFiscale = (cf: string): boolean => {
  return cf.length === 16 && /^[A-Z0-9]{16}$/i.test(cf);
};

// Funzione per generare dati demo dal CF
const generateDemoData = (cf: string) => {
  // Demo data - in produzione verrà da un'API
  const nomi = ['Mario', 'Giovanna', 'Luca', 'Anna', 'Paolo'];
  const cognomi = ['Rossi', 'Bianchi', 'Verdi', 'Neri', 'Gialli'];
  const index = Math.abs(cf.charCodeAt(0)) % nomi.length;
  return {
    nome: nomi[index],
    cognome: cognomi[index],
    dataNascita: '01-01-1980',
  };
};

// Funzione per calcolare score Cure Simultanee
const calculateScoreCureSimultanee = (formData: Partial<RichiestaPrenotazione>): number => {
  let score = 0;
  
  // PS (Karnofsky)
  if (formData.psKarnofsky === '50-60') score += 4;
  
  // Sopravvivenza stimata
  if (formData.sopravvivenzaStimataScore === '6-12 mesi') score += 1;
  if (formData.sopravvivenzaStimataScore === '≤ 6 mesi') score += 2;
  
  // Sintomi
  if (formData.sintomi?.includes('Dolore')) score += 2;
  if (formData.sintomi?.includes('Dispnea')) score += 1;
  if (formData.sintomi?.includes('Iporessia')) score += 1;
  if (formData.sintomi?.includes('Calo Ponderale')) score += 1;
  if (formData.sintomi?.includes('Ansia Depressione')) score += 1;
  
  // Trattamenti con impatto
  if (formData.trattamentiImpatto === 'No') score += 2;
  
  // Tossicità attesa
  if (formData.tossicitaAttesa === 'Ematologica' || formData.tossicitaAttesa === 'Mucosite' || formData.tossicitaAttesa === 'Altro') score += 1;
  
  // Problemi socio-assistenziali
  if (formData.problemiSocioAssistenziali === 'Rete familiare scarsa') score += 1;
  if (formData.problemiSocioAssistenziali === 'Inadeguato supporto') score += 2;
  if (formData.problemiSocioAssistenziali === 'Limitazioni assistenziali') score += 1;
  
  return score;
};

// Funzione per calcolare score Osteoncologia
const calculateScoreOsteoncologia = (formData: Partial<RichiestaPrenotazione>): { score: number; livelloUrgenza: string } => {
  let score = 0;
  
  // Controllo situazioni urgenti
  const hasCompressione = formData.situazioniUrgenti?.includes('Compressione midollare');
  const hasFrattura = formData.situazioniUrgenti?.includes('Frattura patologica');
  
  if (hasCompressione || hasFrattura) {
    return { score: 0, livelloUrgenza: 'URG' };
  }
  
  // PS (Karnofsky)
  if (formData.psKarnofsky === '80') score += 1;
  if (formData.psKarnofsky === '≤ 70') score += 2;
  
  // Segni e Sintomi
  if (formData.segniSintomi === 'Dolore scheletrico') score += 2;
  if (formData.segniSintomi === 'Sintomi da compressione') score += 3;
  
  // Metastasi viscerali
  if (formData.metastasiViscerali === 'Oligometastasi viscerali') score += 1;
  if (formData.metastasiViscerali === 'Multiple lesioni viscerali') score += 2;
  
  // N. metastasi vertebrali
  if (formData.nMetastasiVertebrali === '2') score += 1;
  if (formData.nMetastasiVertebrali === '≥ 3') score += 2;
  
  // Sede malattia primitiva
  if (formData.sedeMalattiaPrimitiva === 'Prostata, mammella, tiroide, ematologica') score += 1;
  if (formData.sedeMalattiaPrimitiva === 'Rene, colon, retto, ginecologici') score += 2;
  if (formData.sedeMalattiaPrimitiva === 'Altre sedi') score += 3;
  if (formData.sedeMalattiaPrimitiva === 'Vie biliari, fegato, polmone, stomaco, esofago, CUP') score += 4;
  
  // Determina livello urgenza
  let livelloUrgenza = '0';
  if (score >= 10) livelloUrgenza = '≥ 10';
  else if (score >= 6) livelloUrgenza = '6-9';
  else if (score >= 1) livelloUrgenza = '1-5';
  
  return { score, livelloUrgenza };
};

// Funzione per calcolare score altri ambulatori
const calculateScoreAltri = (formData: Partial<RichiestaPrenotazione>): number => {
  let score = 0;
  
  if (formData.tosse) score += parseInt(formData.tosse);
  if (formData.dolore) score += parseInt(formData.dolore);
  if (formData.comorbidita) score += parseInt(formData.comorbidita);
  
  return score;
};

function RichiestaPrenotazione({ onBack }: RichiestaPrenotazioneProps) {
  const [formData, setFormData] = useState<Partial<RichiestaPrenotazione>>({
    ambulatorio: undefined,
    codiceFiscale: '',
    patologia: undefined,
    quesito: '',
    impegnativaFile: undefined,
  });
  
  const [datiPaziente, setDatiPaziente] = useState<{ nome?: string; cognome?: string; dataNascita?: string }>({});
  const [impegnativaFileName, setImpegnativaFileName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [livelloUrgenza, setLivelloUrgenza] = useState<string>('');

  // Validazione CF e caricamento dati demo
  useEffect(() => {
    if (formData.codiceFiscale && validateCodiceFiscale(formData.codiceFiscale)) {
      const demoData = generateDemoData(formData.codiceFiscale);
      setDatiPaziente(demoData);
      setFormData(prev => ({ ...prev, nome: demoData.nome, cognome: demoData.cognome, dataNascita: demoData.dataNascita }));
      setErrors(prev => ({ ...prev, codiceFiscale: '' }));
    } else if (formData.codiceFiscale && formData.codiceFiscale.length > 0) {
      setErrors(prev => ({ ...prev, codiceFiscale: 'Il codice fiscale deve essere esattamente 16 caratteri' }));
      setDatiPaziente({});
    }
  }, [formData.codiceFiscale]);

  // Calcolo score quando cambiano i campi rilevanti
  useEffect(() => {
    if (!formData.ambulatorio) {
      setCalculatedScore(null);
      setLivelloUrgenza('');
      return;
    }

    if (formData.ambulatorio === 'Cure Simultanee') {
      const score = calculateScoreCureSimultanee(formData);
      setCalculatedScore(score);
      setLivelloUrgenza('');
    } else if (formData.ambulatorio === 'Osteoncologia') {
      const result = calculateScoreOsteoncologia(formData);
      setCalculatedScore(result.score);
      setLivelloUrgenza(result.livelloUrgenza);
    } else if (formData.ambulatorio !== 'Oncogeriatria') {
      const score = calculateScoreAltri(formData);
      setCalculatedScore(score);
      setLivelloUrgenza('');
    } else {
      setCalculatedScore(null);
      setLivelloUrgenza('');
    }
  }, [formData]);

  const handleInputChange = (field: string, value: string | number | boolean | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, impegnativaFile: 'Solo file PDF sono accettati' }));
        return;
      }
      setImpegnativaFileName(file.name);
      setFormData(prev => ({ ...prev, impegnativaFile: file.name }));
      setErrors(prev => ({ ...prev, impegnativaFile: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ambulatorio) newErrors.ambulatorio = 'Campo obbligatorio';
    if (!formData.codiceFiscale || !validateCodiceFiscale(formData.codiceFiscale)) {
      newErrors.codiceFiscale = 'Codice fiscale obbligatorio e valido (16 caratteri)';
    }
    if (!formData.patologia) newErrors.patologia = 'Campo obbligatorio';
    if (!formData.quesito || formData.quesito.trim() === '') {
      newErrors.quesito = 'Campo obbligatorio';
    }

    // Validazioni condizionali per Osteoncologia
    if (formData.ambulatorio === 'Osteoncologia') {
      if (!formData.uoRiferimento) newErrors.uoRiferimento = 'Campo obbligatorio';
      if (formData.uoRiferimento === 'Altro' && !formData.uoRiferimentoAltro) {
        newErrors.uoRiferimentoAltro = 'Campo obbligatorio';
      }
      if (!formData.sopravvivenzaStimata) newErrors.sopravvivenzaStimata = 'Campo obbligatorio';
      if (!formData.richiestaPer || formData.richiestaPer.length === 0) {
        newErrors.richiestaPer = 'Selezionare almeno un\'opzione';
      }
    }

    // Validazioni condizionali per Oncogeriatria
    if (formData.ambulatorio === 'Oncogeriatria') {
      if (!formData.stadio) newErrors.stadio = 'Campo obbligatorio';
      if (!formData.finalitaTrattamento) newErrors.finalitaTrattamento = 'Campo obbligatorio';
      if (formData.ecogPS === undefined) newErrors.ecogPS = 'Campo obbligatorio';
      if (formData.punteggioG8 === undefined) newErrors.punteggioG8 = 'Campo obbligatorio';
      if (!formData.esitoVGM) newErrors.esitoVGM = 'Campo obbligatorio';
      if (!formData.propostaTerapeutica) newErrors.propostaTerapeutica = 'Campo obbligatorio';
      if (!formData.prognosiOncologica) newErrors.prognosiOncologica = 'Campo obbligatorio';
      if (!formData.finalitaTerapia || formData.finalitaTerapia.length === 0) {
        newErrors.finalitaTerapia = 'Selezionare almeno un\'opzione';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Per favore, compila tutti i campi obbligatori correttamente');
      return;
    }

    // Qui si invierà la richiesta - per ora solo alert
    alert('Richiesta inviata con successo!');
    // Reset form
    setFormData({
      ambulatorio: undefined,
      codiceFiscale: '',
      patologia: undefined,
      quesito: '',
      impegnativaFile: undefined,
    });
    setDatiPaziente({});
    setImpegnativaFileName('');
    setCalculatedScore(null);
    setLivelloUrgenza('');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Torna alla Home
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 pb-6 border-b-2 border-iov-light-blue">
          <h2 className="text-3xl font-bold text-iov-gray-text flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-iov-dark-blue" />
            Richiesta Prenotazione Visita
          </h2>
          <p className="text-gray-500 text-sm mt-2">Compila tutti i campi obbligatori per inviare la richiesta</p>
        </div>

        {/* Sezione: Informazioni Base */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-iov-light-blue-light flex items-center justify-center">
              <FileText className="w-5 h-5 text-iov-dark-blue" />
            </div>
            <h3 className="text-xl font-bold text-iov-gray-text">Informazioni Base</h3>
          </div>

          <div className="space-y-6">
            {/* Ambulatorio */}
            <div>
              <label className="block text-sm font-semibold text-iov-gray-text mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-iov-dark-blue" />
                Ambulatorio <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ambulatorio || ''}
                onChange={(e) => handleInputChange('ambulatorio', e.target.value as Ambulatorio)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all ${
                  errors.ambulatorio ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                }`}
              >
                <option value="">Seleziona ambulatorio</option>
                <option value="Cure Simultanee">Cure Simultanee</option>
                <option value="Oncogeriatria">Oncogeriatria</option>
                <option value="Osteoncologia">Osteoncologia</option>
              </select>
              {errors.ambulatorio && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.ambulatorio}
              </p>}
            </div>

            {/* Codice Fiscale */}
            <div>
              <label className="block text-sm font-semibold text-iov-gray-text mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-iov-dark-blue" />
                Codice Fiscale <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.codiceFiscale}
                onChange={(e) => handleInputChange('codiceFiscale', e.target.value.toUpperCase())}
                maxLength={16}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all font-mono ${
                  errors.codiceFiscale ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                }`}
                placeholder="Inserisci codice fiscale (16 caratteri)"
              />
              {errors.codiceFiscale && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.codiceFiscale}
              </p>}
            </div>

            {/* Dati paziente (mostrati automaticamente se CF valido) */}
            {datiPaziente.nome && (
              <div className="grid md:grid-cols-3 gap-4 bg-gradient-to-br from-iov-light-blue-light to-white p-5 rounded-xl border-2 border-iov-light-blue shadow-sm">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiPaziente.nome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cognome</label>
                  <p className="text-base font-semibold text-iov-gray-text">{datiPaziente.cognome}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data di Nascita</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-base font-semibold text-iov-gray-text">{datiPaziente.dataNascita}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Patologia/PDTA */}
            <div>
              <label className="block text-sm font-semibold text-iov-gray-text mb-2 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-iov-dark-blue" />
                Patologia di riferimento/PDTA <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.patologia || ''}
                onChange={(e) => handleInputChange('patologia', e.target.value as PDTA)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all ${
                  errors.patologia ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                }`}
              >
                <option value="">Seleziona patologia</option>
                <option value="Prostata">Prostata</option>
                <option value="Polmone">Polmone</option>
                <option value="Colon">Colon</option>
                <option value="Retto">Retto</option>
                <option value="Stomaco">Stomaco</option>
                <option value="Sarcomi dei tessuti molli">Sarcomi dei tessuti molli</option>
                <option value="Melanoma">Melanoma</option>
                <option value="Mammella">Mammella</option>
                <option value="Sistema nervoso centrale">Sistema nervoso centrale</option>
              </select>
              {errors.patologia && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.patologia}
              </p>}
            </div>

            {/* Quesito diagnostico */}
            <div>
              <label className="block text-sm font-semibold text-iov-gray-text mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-iov-dark-blue" />
                Quesito diagnostico <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.quesito}
                onChange={(e) => handleInputChange('quesito', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all resize-none ${
                  errors.quesito ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                }`}
                placeholder="Descrivi il quesito diagnostico..."
              />
              {errors.quesito && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.quesito}
              </p>}
            </div>

            {/* Upload PDF impegnativa */}
            <div>
              <label className="block text-sm font-semibold text-iov-gray-text mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-iov-dark-blue" />
                Upload PDF Impegnativa
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
              {errors.impegnativaFile && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.impegnativaFile}
              </p>}
            </div>

            {/* Medico richiedente (solo lettura) */}
            <div>
              <label className="block text-sm font-semibold text-iov-gray-text mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-iov-dark-blue" />
                Medico richiedente
              </label>
              <input
                type="text"
                value="Dr. Carlo Bianchi - Oncologo"
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Campi condizionali per Osteoncologia */}
        {formData.ambulatorio === 'Osteoncologia' && (
          <div className="mb-8 space-y-6 border-t-2 border-iov-light-blue pt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Campi specifici Osteoncologia</h3>
            </div>
            
            <div className="space-y-6">
              {/* U.O. di riferimento */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                  U.O. di riferimento <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.uoRiferimento || ''}
                  onChange={(e) => handleInputChange('uoRiferimento', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all ${
                    errors.uoRiferimento ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                  }`}
                >
                  <option value="">Seleziona U.O.</option>
                  <option value="UOC Oncologia 1">UOC Oncologia 1</option>
                  <option value="UOC Oncologia 2">UOC Oncologia 2</option>
                  <option value="UOC Oncologia 3">UOC Oncologia 3</option>
                  <option value="Radioterapia">Radioterapia</option>
                  <option value="Unità Tumori Ereditari">Unità Tumori Ereditari</option>
                  <option value="Altro">Altro</option>
                </select>
                {errors.uoRiferimento && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.uoRiferimento}
                </p>}
              </div>

              {/* U.O. Altro */}
              {formData.uoRiferimento === 'Altro' && (
                <div>
                  <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                    Specifica U.O. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.uoRiferimentoAltro || ''}
                    onChange={(e) => handleInputChange('uoRiferimentoAltro', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all ${
                      errors.uoRiferimentoAltro ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                    }`}
                  />
                  {errors.uoRiferimentoAltro && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.uoRiferimentoAltro}
                  </p>}
                </div>
              )}

              {/* Sopravvivenza stimata */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Sopravvivenza stimata <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['≥12 mesi', '6-12 mesi', '< 6 mesi'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="sopravvivenzaStimata"
                        value={option}
                        checked={formData.sopravvivenzaStimata === option}
                        onChange={(e) => handleInputChange('sopravvivenzaStimata', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.sopravvivenzaStimata && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.sopravvivenzaStimata}
                </p>}
              </div>

              {/* Quesito al team multidisciplinare */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                  Quesito al team multidisciplinare
                </label>
                <textarea
                  value={formData.quesitoTeam || ''}
                  onChange={(e) => handleInputChange('quesitoTeam', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all resize-none hover:border-iov-dark-blue"
                  placeholder="Descrivi il quesito al team multidisciplinare..."
                />
              </div>

              {/* Richiesta per */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Richiesta per <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['visita', 'discussione'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.richiestaPer?.includes(option) || false}
                        onChange={(e) => {
                          const current = formData.richiestaPer || [];
                          if (e.target.checked) {
                            handleInputChange('richiestaPer', [...current, option]);
                          } else {
                            handleInputChange('richiestaPer', current.filter((v: string) => v !== option));
                          }
                        }}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                      />
                      <span className="text-iov-gray-text font-medium capitalize">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.richiestaPer && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.richiestaPer}
                </p>}
              </div>
            </div>

            {/* Valutazione score clinico per Osteoncologia */}
            <div className="border-t-2 border-purple-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-iov-gray-text">Valutazione Score Clinico</h4>
              </div>
              
              {/* PS (Karnofsky) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">PS (Karnofsky)</label>
                <div className="space-y-2">
                  {[
                    { value: '100-90', points: 0 },
                    { value: '80', points: 1 },
                    { value: '≤ 70', points: 2 },
                  ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="psKarnofskyOsteo"
                      value={option.value}
                      checked={formData.psKarnofsky === option.value}
                      onChange={(e) => handleInputChange('psKarnofsky', e.target.value)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                    />
                    <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                  </label>
                  ))}
                </div>
              </div>

              {/* Segni e Sintomi */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Segni e Sintomi</label>
                <div className="space-y-2">
                  {[
                    { value: 'Nessuno', points: 0 },
                    { value: 'Dolore scheletrico', points: 2 },
                    { value: 'Sintomi da compressione', points: 3 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="segniSintomi"
                        value={option.value}
                        checked={formData.segniSintomi === option.value}
                        onChange={(e) => handleInputChange('segniSintomi', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Presenza di metastasi viscerali */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Presenza di metastasi viscerali</label>
                <div className="space-y-2">
                  {[
                    { value: 'Nessuna viscerale', points: 0 },
                    { value: 'Oligometastasi viscerali', points: 1 },
                    { value: 'Multiple lesioni viscerali', points: 2 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="metastasiViscerali"
                        value={option.value}
                        checked={formData.metastasiViscerali === option.value}
                        onChange={(e) => handleInputChange('metastasiViscerali', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* N. metastasi vertebrali */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">N. metastasi vertebrali</label>
                <div className="space-y-2">
                  {[
                    { value: '0-1', points: 0 },
                    { value: '2', points: 1 },
                    { value: '≥ 3', points: 2 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="nMetastasiVertebrali"
                        value={option.value}
                        checked={formData.nMetastasiVertebrali === option.value}
                        onChange={(e) => handleInputChange('nMetastasiVertebrali', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sede malattia primitiva */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Sede malattia primitiva</label>
                <div className="space-y-2">
                  {[
                    { value: 'Prostata, mammella, tiroide, ematologica', points: 1 },
                    { value: 'Rene, colon, retto, ginecologici', points: 2 },
                    { value: 'Altre sedi', points: 3 },
                    { value: 'Vie biliari, fegato, polmone, stomaco, esofago, CUP', points: 4 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="sedeMalattiaPrimitiva"
                        value={option.value}
                        checked={formData.sedeMalattiaPrimitiva === option.value}
                        onChange={(e) => handleInputChange('sedeMalattiaPrimitiva', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium text-sm">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Situazioni urgenti */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Situazioni urgenti</label>
                <div className="space-y-2">
                  {['Compressione midollare', 'Frattura patologica'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-red-200 hover:border-red-400 hover:bg-red-50 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.situazioniUrgenti?.includes(option) || false}
                        onChange={(e) => {
                          const current = formData.situazioniUrgenti || [];
                          if (e.target.checked) {
                            handleInputChange('situazioniUrgenti', [...current, option]);
                          } else {
                            handleInputChange('situazioniUrgenti', current.filter((v: string) => v !== option));
                          }
                        }}
                        className="w-5 h-5 text-red-600 focus:ring-2 focus:ring-red-500 rounded"
                      />
                      <span className="text-red-700 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mostra score e livello urgenza */}
              {(calculatedScore !== null || livelloUrgenza) && (
                <div className={`p-6 rounded-xl mt-6 border-2 shadow-lg ${
                  livelloUrgenza === 'URG' 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300' 
                    : 'bg-gradient-to-br from-iov-light-blue-light to-white border-iov-light-blue'
                }`}>
                  {livelloUrgenza === 'URG' ? (
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-red-700 text-xl mb-2">⚠️ URGENTE</p>
                        <p className="text-sm text-red-600">
                          Primo ambulatorio utile (intanto contattare ortopedico e/o RT per valutazione urgente del paziente)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-iov-gray-text text-lg">Score Totale</p>
                        <span className="text-3xl font-bold text-iov-dark-blue bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                          {calculatedScore}
                        </span>
                      </div>
                      {livelloUrgenza && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Livello urgenza: <span className="text-iov-dark-blue">{livelloUrgenza}</span></p>
                          <p className="text-sm text-iov-gray-text">
                            {livelloUrgenza === '≥ 10' ? 'Programmazione entro 10 giorni' :
                            livelloUrgenza === '6-9' ? 'Programmazione entro 20 giorni' :
                            livelloUrgenza === '1-5' ? 'Programmazione entro 30 giorni' :
                            'Punteggio non valido'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campi condizionali per Oncogeriatria */}
        {formData.ambulatorio === 'Oncogeriatria' && (
          <div className="mb-8 space-y-6 border-t-2 border-iov-light-blue pt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Campi specifici Oncogeriatria</h3>
            </div>
            
            <div className="space-y-6">
              {/* Stadio */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Stadio <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['radicalmente operato', 'localmente avanzato', 'avanzato/metastatico'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="stadio"
                        value={option}
                        checked={formData.stadio === option}
                        onChange={(e) => handleInputChange('stadio', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.stadio && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.stadio}
                </p>}
              </div>

              {/* Finalità del trattamento */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Finalità del trattamento <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['(neo) adiuvante', 'curativo', 'pallativo'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="finalitaTrattamento"
                        value={option}
                        checked={formData.finalitaTrattamento === option}
                        onChange={(e) => handleInputChange('finalitaTrattamento', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.finalitaTrattamento && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.finalitaTrattamento}
                </p>}
              </div>

              {/* ECOG PS */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                  ECOG PS <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.ecogPS || ''}
                  onChange={(e) => handleInputChange('ecogPS', parseInt(e.target.value) || undefined)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all ${
                    errors.ecogPS ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                  }`}
                />
                {errors.ecogPS && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ecogPS}
                </p>}
              </div>

              {/* Punteggio G8 */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                  Punteggio G8 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.punteggioG8 || ''}
                  onChange={(e) => handleInputChange('punteggioG8', parseInt(e.target.value) || undefined)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all ${
                    errors.punteggioG8 ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-iov-dark-blue'
                  }`}
                />
                {errors.punteggioG8 && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.punteggioG8}
                </p>}
              </div>

              {/* Esito VGM */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Esito VGM <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['fragile', 'vulnerabile', 'fit'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="esitoVGM"
                        value={option}
                        checked={formData.esitoVGM === option}
                        onChange={(e) => handleInputChange('esitoVGM', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium capitalize">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.esitoVGM && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.esitoVGM}
                </p>}
              </div>

              {/* Proposta terapeutica */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Proposta terapeutica <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    'terapia standard - dosi standard',
                    'terapia standard - dosi ridotte (eventualmente da aumentare)',
                    'terapia standard - dosi ridotte (non previsto aumento dosi)',
                    'nessuna terapia',
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="propostaTerapeutica"
                        value={option}
                        checked={formData.propostaTerapeutica === option}
                        onChange={(e) => handleInputChange('propostaTerapeutica', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.propostaTerapeutica && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.propostaTerapeutica}
                </p>}
              </div>

              {/* Prognosi oncologica */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Prognosi oncologica <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['<12 mesi', '12-24 mesi', '>24 mesi'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="prognosiOncologica"
                        value={option}
                        checked={formData.prognosiOncologica === option}
                        onChange={(e) => handleInputChange('prognosiOncologica', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.prognosiOncologica && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.prognosiOncologica}
                </p>}
              </div>

              {/* Finalità della terapia oncologica */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Finalità della terapia oncologica <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['Aumento OS / PFS', 'Miglioramento sintomi / qualità di vita'].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.finalitaTerapia?.includes(option) || false}
                        onChange={(e) => {
                          const current = formData.finalitaTerapia || [];
                          if (e.target.checked) {
                            handleInputChange('finalitaTerapia', [...current, option]);
                          } else {
                            handleInputChange('finalitaTerapia', current.filter((v: string) => v !== option));
                          }
                        }}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                      />
                      <span className="text-iov-gray-text font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.finalitaTerapia && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.finalitaTerapia}
                </p>}
              </div>

              {/* Rischio tossicità */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                    % Tossicità ematologica G3/G4
                  </label>
                  <input
                    type="number"
                    value={formData.tossicitaEmatologica || ''}
                    onChange={(e) => handleInputChange('tossicitaEmatologica', parseFloat(e.target.value) || undefined)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all hover:border-iov-dark-blue"
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-iov-gray-text mb-2">
                    % Tossicità extra-ematologica G3/G4
                  </label>
                  <input
                    type="number"
                    value={formData.tossicitaExtraEmatologica || ''}
                    onChange={(e) => handleInputChange('tossicitaExtraEmatologica', parseFloat(e.target.value) || undefined)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all hover:border-iov-dark-blue"
                    placeholder="0-100"
                  />
                </div>
              </div>

              {/* Quesiti per geriatra */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Quesiti per geriatra
                </label>
                <div className="space-y-2">
                  {[
                    'Attuabilità programma proposto',
                    'Necessità di presa in carico durante la terapia: Geriatrica',
                    'Necessità di presa in carico durante la terapia: Di altro specialista',
                    'Necessità di rivalutazione geriatrica al termine della terapia',
                    'Valutazione rischio cognitive impairment',
                    'Revisione polifarmacoterapia',
                    'Altro',
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.quesitiGeriatra?.includes(option) || false}
                        onChange={(e) => {
                          const current = formData.quesitiGeriatra || [];
                          if (e.target.checked) {
                            handleInputChange('quesitiGeriatra', [...current, option]);
                          } else {
                            handleInputChange('quesitiGeriatra', current.filter((v: string) => v !== option));
                            if (option === 'Altro') {
                              handleInputChange('quesitiGeriatraAltro', '');
                            }
                          }
                        }}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                      />
                      <span className="text-iov-gray-text font-medium">{option}</span>
                    </label>
                  ))}
                </div>
                {formData.quesitiGeriatra?.includes('Altro') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.quesitiGeriatraAltro || ''}
                      onChange={(e) => handleInputChange('quesitiGeriatraAltro', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all hover:border-iov-dark-blue"
                      placeholder="Specifica altro quesito..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Output valutazione geriatrica - sezione separata */}
            <div className="border-t-2 border-green-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-iov-gray-text">Output Valutazione Geriatrica</h4>
              </div>
              
              <div className="space-y-6">
                {/* Programma attuabile */}
                <div>
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.programmaAttuabile || false}
                      onChange={(e) => handleInputChange('programmaAttuabile', e.target.checked)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                    />
                    <span className="text-iov-gray-text font-medium">Programma attuabile senza programmazione altre visite oncogeriatriche</span>
                  </label>
                </div>

                {/* Presa in carico geriatrica */}
                <div>
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.presaInCaricoGeriatrica || false}
                      onChange={(e) => handleInputChange('presaInCaricoGeriatrica', e.target.checked)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                    />
                    <span className="text-iov-gray-text font-medium">Necessità di presa in carico geriatrica durante la terapia con tempistica</span>
                  </label>
                  {formData.presaInCaricoGeriatrica && (
                    <input
                      type="text"
                      value={formData.presaInCaricoGeriatricaTempistica || ''}
                      onChange={(e) => handleInputChange('presaInCaricoGeriatricaTempistica', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all hover:border-iov-dark-blue"
                      placeholder="Specifica tempistica..."
                    />
                  )}
                </div>

                {/* Presa in carico altro specialista */}
                <div>
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.presaInCaricoAltroSpecialista || false}
                      onChange={(e) => handleInputChange('presaInCaricoAltroSpecialista', e.target.checked)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                    />
                    <span className="text-iov-gray-text font-medium">Necessità di presa in carico altro specialista</span>
                  </label>
                  {formData.presaInCaricoAltroSpecialista && (
                    <input
                      type="text"
                      value={formData.presaInCaricoAltroSpecialistaDettaglio || ''}
                      onChange={(e) => handleInputChange('presaInCaricoAltroSpecialistaDettaglio', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all hover:border-iov-dark-blue"
                      placeholder="Specifica specialista..."
                    />
                  )}
                </div>

                {/* Rischio cognitive impairment */}
                <div>
                  <label className="block text-sm font-semibold text-iov-gray-text mb-3">Rischio cognitive impairment</label>
                  <div className="space-y-2">
                    {['basso', 'moderato', 'alto', 'non valutabile'].map((option) => (
                      <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                        <input
                          type="radio"
                          name="rischioCognitiveImpairment"
                          value={option}
                          checked={formData.rischioCognitiveImpairment === option}
                          onChange={(e) => handleInputChange('rischioCognitiveImpairment', e.target.value)}
                          className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                        />
                        <span className="text-iov-gray-text font-medium capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                  {formData.rischioCognitiveImpairment === 'non valutabile' && (
                    <input
                      type="text"
                      value={formData.rischioCognitiveImpairmentDettaglio || ''}
                      onChange={(e) => handleInputChange('rischioCognitiveImpairmentDettaglio', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all hover:border-iov-dark-blue mt-3"
                      placeholder="Specifica motivo..."
                    />
                  )}
                </div>

                {/* Revisione polifarmacoterapia */}
                <div>
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.revisionePolifarmacoterapia || false}
                      onChange={(e) => handleInputChange('revisionePolifarmacoterapia', e.target.checked)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                    />
                    <span className="text-iov-gray-text font-medium">Revisione polifarmacoterapia effettuata</span>
                  </label>
                  {formData.revisionePolifarmacoterapia && (
                    <div className="mt-2 space-y-2">
                      {[
                        'riduzione numero totale di farmaci',
                        'aumento numero totale di farmaci',
                        'farmaci modificati, stesso numero totale',
                      ].map((option) => (
                        <label key={option} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                          <input
                            type="radio"
                            name="revisionePolifarmacoterapiaDettaglio"
                            value={option}
                            checked={formData.revisionePolifarmacoterapiaDettaglio === option}
                            onChange={(e) => handleInputChange('revisionePolifarmacoterapiaDettaglio', e.target.value)}
                            className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                          />
                          <span className="text-iov-gray-text font-medium text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attivazione servizi domiciliari */}
                <div>
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.attivazioneServiziDomiciliari || false}
                      onChange={(e) => handleInputChange('attivazioneServiziDomiciliari', e.target.checked)}
                      className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                    />
                    <span className="text-iov-gray-text font-medium">Necessità attivazione servizi domiciliari</span>
                  </label>
                </div>

                {/* Altro output */}
                <div>
                  <label className="block text-sm font-semibold text-iov-gray-text mb-2">Altro</label>
                  <textarea
                    value={formData.altroOutput || ''}
                    onChange={(e) => handleInputChange('altroOutput', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-iov-dark-blue transition-all resize-none hover:border-iov-dark-blue"
                    placeholder="Inserisci altri output della valutazione geriatrica..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valutazione score clinico per Cure Simultanee */}
        {formData.ambulatorio === 'Cure Simultanee' && (
          <div className="mb-8 space-y-6 border-t-2 border-iov-light-blue pt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Valutazione Score Clinico</h3>
            </div>
            
            <div className="space-y-6">
              {/* PS (Karnofsky) */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">PS (Karnofsky)</label>
                <div className="space-y-2">
                  {[
                    { value: '>70', points: 0 },
                    { value: '50-60', points: 4 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="psKarnofskyCure"
                        value={option.value}
                        checked={formData.psKarnofsky === option.value}
                        onChange={(e) => handleInputChange('psKarnofsky', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sopravvivenza stimata */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Sopravvivenza stimata</label>
                <div className="space-y-2">
                  {[
                    { value: '≥ 12 mesi', points: 0 },
                    { value: '6-12 mesi', points: 1 },
                    { value: '≤ 6 mesi', points: 2 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="sopravvivenzaStimataScore"
                        value={option.value}
                        checked={formData.sopravvivenzaStimataScore === option.value}
                        onChange={(e) => handleInputChange('sopravvivenzaStimataScore', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sintomi */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Sintomi</label>
                <div className="space-y-2">
                  {[
                    { value: 'Dolore', points: 2 },
                    { value: 'Dispnea', points: 1 },
                    { value: 'Iporessia', points: 1 },
                    { value: 'Calo Ponderale', points: 1 },
                    { value: 'Ansia Depressione', points: 1 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sintomi?.includes(option.value) || false}
                        onChange={(e) => {
                          const current = formData.sintomi || [];
                          if (e.target.checked) {
                            handleInputChange('sintomi', [...current, option.value]);
                          } else {
                            handleInputChange('sintomi', current.filter((v: string) => v !== option.value));
                          }
                        }}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue rounded"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trattamenti con impatto sulla sopravvivenza */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">
                  Trattamenti con impatto sulla sopravvivenza
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'si', points: 0 },
                    { value: 'No', points: 2 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="trattamentiImpatto"
                        value={option.value}
                        checked={formData.trattamentiImpatto === option.value}
                        onChange={(e) => handleInputChange('trattamentiImpatto', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tossicità attesa */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Tossicità attesa</label>
                <div className="space-y-2">
                  {[
                    { value: 'Nessuna', points: 0 },
                    { value: 'Ematologica', points: 1 },
                    { value: 'Mucosite', points: 1 },
                    { value: 'Altro', points: 1 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="tossicitaAttesa"
                        value={option.value}
                        checked={formData.tossicitaAttesa === option.value}
                        onChange={(e) => handleInputChange('tossicitaAttesa', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Problemi socio-assistenziali */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Problemi socio-assistenziali</label>
                <div className="space-y-2">
                  {[
                    { value: 'Nessuno', points: 0 },
                    { value: 'Rete familiare scarsa', points: 1 },
                    { value: 'Inadeguato supporto', points: 2 },
                    { value: 'Limitazioni assistenziali', points: 1 },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="problemiSocioAssistenziali"
                        value={option.value}
                        checked={formData.problemiSocioAssistenziali === option.value}
                        onChange={(e) => handleInputChange('problemiSocioAssistenziali', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium">{option.value} <span className="text-iov-dark-blue font-semibold">({option.points} punti)</span></span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Mostra score calcolato */}
            {calculatedScore !== null && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white p-6 rounded-xl border-2 border-iov-light-blue shadow-lg mt-6">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-iov-gray-text text-lg">Score Totale</p>
                  <span className="text-3xl font-bold text-iov-dark-blue bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                    {calculatedScore}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Valutazione score per altri ambulatori */}
        {formData.ambulatorio && formData.ambulatorio !== 'Cure Simultanee' && formData.ambulatorio !== 'Osteoncologia' && formData.ambulatorio !== 'Oncogeriatria' && (
          <div className="mb-8 space-y-6 border-t-2 border-iov-light-blue pt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-iov-gray-text">Valutazione Score Clinico</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Tosse */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Tosse</label>
                <div className="space-y-2">
                  {[
                    { value: '3', label: '3 (Grave)' },
                    { value: '2', label: '2 (Moderata)' },
                    { value: '1', label: '1 (Lieve)' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="tosse"
                        value={option.value}
                        checked={formData.tosse === option.value}
                        onChange={(e) => handleInputChange('tosse', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dolore */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Dolore</label>
                <div className="space-y-2">
                  {[
                    { value: '3', label: '3 (Intenso)' },
                    { value: '2', label: '2 (Moderato)' },
                    { value: '1', label: '1 (Lieve)' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="dolore"
                        value={option.value}
                        checked={formData.dolore === option.value}
                        onChange={(e) => handleInputChange('dolore', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comorbidità */}
              <div>
                <label className="block text-sm font-semibold text-iov-gray-text mb-3">Comorbidità</label>
                <div className="space-y-2">
                  {[
                    { value: '3', label: '3 (Multiple)' },
                    { value: '2', label: '2 (Moderate)' },
                    { value: '1', label: '1 (Lieve)' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-iov-dark-blue hover:bg-iov-light-blue-light transition-all cursor-pointer">
                      <input
                        type="radio"
                        name="comorbidita"
                        value={option.value}
                        checked={formData.comorbidita === option.value}
                        onChange={(e) => handleInputChange('comorbidita', e.target.value)}
                        className="w-5 h-5 text-iov-dark-blue focus:ring-2 focus:ring-iov-dark-blue"
                      />
                      <span className="text-iov-gray-text font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Mostra score calcolato */}
            {calculatedScore !== null && (
              <div className="bg-gradient-to-br from-iov-light-blue-light to-white p-6 rounded-xl border-2 border-iov-light-blue shadow-lg mt-6">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-iov-gray-text text-lg">Score Totale</p>
                  <span className="text-3xl font-bold text-iov-dark-blue bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                    {calculatedScore}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pulsanti invio */}
        <div className="flex justify-end gap-4 mt-10 pt-8 border-t-2 border-iov-light-blue">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border-2 border-gray-300 text-iov-gray-text rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-iov-dark-blue to-iov-dark-blue-hover text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold shadow-md"
          >
            <Send className="w-5 h-5" />
            Invia Richiesta
          </button>
        </div>
      </form>
    </div>
  );
}

export default RichiestaPrenotazione;

