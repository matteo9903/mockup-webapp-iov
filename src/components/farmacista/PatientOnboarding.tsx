import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { SedeIOV, PatientAnagraphics, CaregiverContacts, Drug } from '../../types/index.ts';

type Step = 1 | 2 | 3;

function PatientOnboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Step 1: Pharmacological ID Card
    const [sedeIOV, setSedeIOV] = useState<SedeIOV>('Padova');
    const [patient, setPatient] = useState<PatientAnagraphics>({
        name: '',
        surname: '',
        address: '',
        telephone: '',
        fiscalCode: '',
    });
    const [caregiver, setCaregiver] = useState<CaregiverContacts>({
        name: '',
        surname: '',
        telephone: '',
    });

    // Step 2: Therapy Plan
    const [drugs, setDrugs] = useState<Drug[]>([
        { id: '1', activePrinciple: '', hourOfAssumption: '', dosage: '' },
    ]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const addDrug = () => {
        setDrugs([...drugs, { id: Date.now().toString(), activePrinciple: '', hourOfAssumption: '', dosage: '' }]);
    };

    const removeDrug = (id: string) => {
        if (drugs.length > 1) {
            setDrugs(drugs.filter((d) => d.id !== id));
        }
    };

    const updateDrug = (id: string, field: keyof Drug, value: string) => {
        setDrugs(drugs.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
    };

    const handleSubmit = () => {
        // In a real app, this would submit to backend
        alert('Onboarding completato! Richiesta inviata per approvazione.');
        navigate('/farmacista/patients');
    };

    const canProceedStep1 = patient.name && patient.surname && patient.address && patient.telephone && patient.fiscalCode && caregiver.name && caregiver.surname && caregiver.telephone;
    const canProceedStep2 = drugs.every((d) => d.activePrinciple && d.hourOfAssumption && d.dosage) && startDate && endDate;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Onboarding Nuovo Paziente</h1>
                <p className="text-iov-gray-text">Compila la carta d'identità farmacologica e il piano terapeutico</p>
            </div>

            {/* Progress steps */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step ? 'bg-iov-dark-blue text-white' : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {currentStep > step ? <Check className="w-6 h-6" /> : step}
                            </div>
                            {step < 3 && (
                                <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-iov-dark-blue' : 'bg-gray-200'}`}></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-sm">
                    <span className={currentStep >= 1 ? 'text-iov-dark-blue font-medium' : 'text-gray-500'}>
                        Carta d'Identità
                    </span>
                    <span className={currentStep >= 2 ? 'text-iov-dark-blue font-medium' : 'text-gray-500'}>Piano Terapeutico</span>
                    <span className={currentStep >= 3 ? 'text-iov-dark-blue font-medium' : 'text-gray-500'}>Revisione</span>
                </div>
            </div>

            {/* Step content */}
            <div className="bg-white rounded-xl shadow-md p-8">
                {/* Step 1: Pharmacological ID Card */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-iov-dark-blue mb-4">Carta d'Identità Farmacologica</h2>

                        {/* Sede IOV */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Sede IOV *</label>
                            <select
                                value={sedeIOV}
                                onChange={(e) => setSedeIOV(e.target.value as SedeIOV)}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                            >
                                <option value="Padova">Padova</option>
                                <option value="Castelfranco Veneto">Castelfranco Veneto</option>
                            </select>
                        </div>

                        {/* Patient Anagraphics */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Dati Anagrafici Paziente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Nome *</label>
                                    <input
                                        type="text"
                                        value={patient.name}
                                        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Nome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Cognome *</label>
                                    <input
                                        type="text"
                                        value={patient.surname}
                                        onChange={(e) => setPatient({ ...patient, surname: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Cognome"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Indirizzo *</label>
                                    <input
                                        type="text"
                                        value={patient.address}
                                        onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Via, Città"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Telefono *</label>
                                    <input
                                        type="tel"
                                        value={patient.telephone}
                                        onChange={(e) => setPatient({ ...patient, telephone: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="049-1234567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Codice Fiscale *</label>
                                    <input
                                        type="text"
                                        value={patient.fiscalCode}
                                        onChange={(e) => setPatient({ ...patient, fiscalCode: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="RSSMRA80A01H501Z"
                                        maxLength={16}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Caregiver Contacts */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Contatti Caregiver</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Nome *</label>
                                    <input
                                        type="text"
                                        value={caregiver.name}
                                        onChange={(e) => setCaregiver({ ...caregiver, name: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Nome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Cognome *</label>
                                    <input
                                        type="text"
                                        value={caregiver.surname}
                                        onChange={(e) => setCaregiver({ ...caregiver, surname: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Cognome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Telefono *</label>
                                    <input
                                        type="tel"
                                        value={caregiver.telephone}
                                        onChange={(e) => setCaregiver({ ...caregiver, telephone: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="340-1234567"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Therapy Plan */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-iov-dark-blue mb-4">Piano Terapeutico</h2>

                        {/* Drugs */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-iov-dark-blue">Farmaci</h3>
                                <button
                                    onClick={addDrug}
                                    className="bg-iov-yellow text-iov-yellow-text px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Aggiungi Farmaco
                                </button>
                            </div>

                            {drugs.map((drug, index) => (
                                <div key={drug.id} className="bg-iov-light-blue p-4 rounded-lg mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-iov-dark-blue-text">Farmaco {index + 1}</h4>
                                        {drugs.length > 1 && (
                                            <button
                                                onClick={() => removeDrug(drug.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-iov-dark-blue-text mb-2">
                                                Principio Attivo / Nome Farmaco *
                                            </label>
                                            <input
                                                type="text"
                                                value={drug.activePrinciple}
                                                onChange={(e) => updateDrug(drug.id, 'activePrinciple', e.target.value)}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                                placeholder="Es. Paracetamolo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-iov-dark-blue-text mb-2">Ora Assunzione *</label>
                                            <input
                                                type="time"
                                                value={drug.hourOfAssumption}
                                                onChange={(e) => updateDrug(drug.id, 'hourOfAssumption', e.target.value)}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-iov-dark-blue-text mb-2">Dosaggio *</label>
                                            <input
                                                type="text"
                                                value={drug.dosage}
                                                onChange={(e) => updateDrug(drug.id, 'dosage', e.target.value)}
                                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                                placeholder="Es. 500mg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dates */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Periodo Terapia</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Data Inizio *</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Data Fine *</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-iov-dark-blue mb-4">Revisione e Invio</h2>

                        {/* ID Card Summary */}
                        <div className="bg-iov-light-blue p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-iov-dark-blue-text mb-4">Carta d'Identità Farmacologica</h3>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <strong>Sede IOV:</strong> {sedeIOV}
                                </p>
                                <p>
                                    <strong>Paziente:</strong> {patient.name} {patient.surname}
                                </p>
                                <p>
                                    <strong>Indirizzo:</strong> {patient.address}
                                </p>
                                <p>
                                    <strong>Telefono:</strong> {patient.telephone}
                                </p>
                                <p>
                                    <strong>Codice Fiscale:</strong> {patient.fiscalCode}
                                </p>
                                <p>
                                    <strong>Caregiver:</strong> {caregiver.name} {caregiver.surname} - {caregiver.telephone}
                                </p>
                            </div>
                        </div>

                        {/* Therapy Plan Summary */}
                        <div className="bg-iov-pink p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-iov-pink-text mb-4">Piano Terapeutico</h3>
                            <div className="space-y-3">
                                <p className="text-sm">
                                    <strong>Periodo:</strong> {startDate} - {endDate}
                                </p>
                                <div>
                                    <strong className="text-sm">Farmaci:</strong>
                                    <ul className="mt-2 space-y-2">
                                        {drugs.map((drug, index) => (
                                            <li key={drug.id} className="bg-white p-3 rounded-lg text-sm">
                                                <strong>Farmaco {index + 1}:</strong> {drug.activePrinciple} - {drug.dosage} alle ore{' '}
                                                {drug.hourOfAssumption}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Nota:</strong> La richiesta verrà inviata al clinico per approvazione. Il paziente sarà visibile
                                nella lista pazienti con stato "In approvazione".
                            </p>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
                    <button
                        onClick={() => {
                            if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
                            else navigate('/farmacista/home');
                        }}
                        className="flex items-center gap-2 px-6 py-3 text-iov-dark-blue hover:bg-iov-light-blue rounded-lg transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {currentStep === 1 ? 'Annulla' : 'Indietro'}
                    </button>

                    {currentStep < 3 && (
                        <button
                            onClick={() => setCurrentStep((currentStep + 1) as Step)}
                            disabled={currentStep === 1 ? !canProceedStep1 : !canProceedStep2}
                            className="flex items-center gap-2 px-6 py-3 bg-iov-dark-blue text-white rounded-lg hover:bg-iov-dark-blue-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Avanti
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}

                    {currentStep === 3 && (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <Check className="w-5 h-5" />
                            Invia per Approvazione
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatientOnboarding;
