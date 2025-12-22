import { type Dispatch, type SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Plus } from 'lucide-react';
import {
    SedeIOV,
    PatientAnagraphics,
    CaregiverContacts,
    EmergencyNumbers,
    SpecialistContacts,
    OncologyDiagnosis,
    Drug,
    DrugPhase,
    DrugSchedule,
    DrugDosage,
    DosageUnit,
    DrugScheduleFrequency,
} from '../../types/index.ts';
import { mockDrugs } from '../../data/mockData.ts';
import { formatDrugDosage, formatDrugSchedule, formatDosageValue, formatScheduleValue } from '../../utils/drugFormat.ts';

type Step = 1 | 2 | 3;
const scheduleFrequencyOptions: { value: DrugScheduleFrequency; label: string }[] = [
    { value: 'DAILY', label: 'Giornaliero' },
    { value: 'EVERY_OTHER_DAY', label: 'Giorni alterni' },
    { value: 'ODD_DAYS', label: 'Giorni dispari' },
    { value: 'EVEN_DAYS', label: 'Giorni pari' },
    { value: 'CUSTOM', label: 'Personalizzato' },
    { value: 'NONE', label: 'Nessuno' },
];

const dosageUnitOptions: DosageUnit[] = ['MG', 'MG_M2', 'G', 'MG_KG'];

const cloneProtocol = (protocol: Drug): Drug => JSON.parse(JSON.stringify(protocol));

const formatDateLabel = (value?: string): string =>
    value ? new Date(value).toLocaleDateString('it-IT') : '—';

const getDefaultPhaseWindow = () => {
    const today = new Date();
    const start = today.toISOString().split('T')[0];
    const endRef = new Date(today);
    endRef.setDate(endRef.getDate() + 6);
    const end = endRef.toISOString().split('T')[0];
    return { start, end };
};

const createEmptyPhase = (drug: Drug): DrugPhase => {
    const scheduleByDrug = drug.drugs.reduce<Record<string, DrugSchedule>>((acc, name) => {
        acc[name] = { frequency: 'DAILY', times: [] };
        return acc;
    }, {});
    const dosageByDrug = drug.drugs.reduce<Record<string, DrugDosage>>((acc, name) => {
        acc[name] = { amount: null };
        return acc;
    }, {});

    const { start, end } = getDefaultPhaseWindow();
    return {
        name: `Nuova fase ${drug.phases.length + 1}`,
        startDate: start,
        endDate: end,
        scheduleByDrug,
        dosageByDrug,
    };
};

interface ScheduleTimesEditorProps {
    times: string[];
    onAdd: (time: string) => void;
    onRemove: (index: number) => void;
}

function ScheduleTimesEditor({ times, onAdd, onRemove }: ScheduleTimesEditorProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTime, setNewTime] = useState('');
    const buttonLabel = times.length ? 'Aggiungi altro orario' : 'Aggiungi orario';

    const handleSave = () => {
        if (!newTime) {
            return;
        }
        if (!times.includes(newTime)) {
            onAdd(newTime);
        }
        setNewTime('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {times.length === 0 ? (
                    <span className="text-xs text-gray-500">Nessun orario impostato</span>
                ) : (
                    times.map((time, idx) => (
                        <span
                            key={`${time}-${idx}`}
                            className="inline-flex items-center gap-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-iov-dark-blue"
                        >
                            {time}
                            <button
                                type="button"
                                onClick={() => onRemove(idx)}
                                className="text-red-500 hover:text-red-700"
                                aria-label={`Rimuovi orario ${time}`}
                            >
                                ×
                            </button>
                        </span>
                    ))
                )}
            </div>
            {isAdding ? (
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleSave}
                        className="text-xs bg-iov-dark-blue text-white px-3 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Salva orario
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAdding(false);
                            setNewTime('');
                        }}
                        className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Annulla
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="text-xs text-iov-dark-blue font-semibold hover:text-iov-dark-blue-hover"
                >
                    {buttonLabel}
                </button>
            )}
        </div>
    );
}

function PatientOnboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Step 1: Pharmacological ID Card
    const [sedeIOV, setSedeIOV] = useState<SedeIOV>('Padova');
    const [patient, setPatient] = useState<PatientAnagraphics>({
        name: '',
        surname: '',
        birthDate: '',
        address: '',
        telephone: '',
        fiscalCode: '',
        healthCardNumber: '',
    });
    const [caregiver, setCaregiver] = useState<CaregiverContacts>({
        name: '',
        surname: '',
        telephone: '',
    });
    const [emergencyNumbers, setEmergencyNumbers] = useState<EmergencyNumbers>({
        publicSafety: '113',
        healthEmergency: '118',
        nue: '112',
        guardiaMedica: '',
    });
    const [specialistContacts, setSpecialistContacts] = useState<SpecialistContacts>({
        oncologyConsultation: '',
        oncologyUrgency: '',
        hospitalPharmacy: '',
    });
    const [diagnosis, setDiagnosis] = useState<OncologyDiagnosis>({
        pathology: '',
        currentTherapies: '',
        administration: {
            oral: false,
            endovenous: false,
            subcutaneous: false,
            other: '',
        },
    });
    const [comorbidities, setComorbidities] = useState<string[]>(['', '', '']);
    const [allergies, setAllergies] = useState<string[]>(['', '', '']);

    // Step 2: Therapy Plan
    const [selectedProtocols, setSelectedProtocols] = useState<Drug[]>([]);
    const [protocolToAdd, setProtocolToAdd] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const renderPhaseDetails = (drug: Drug) => (
        <div className="mt-3 space-y-2 text-xs text-gray-600">
            {drug.phases.map((phase, idx) => (
                <div key={`${drug.id}-phase-summary-${idx}`} className="border-l-2 border-iov-light-blue pl-3 bg-gray-50 rounded-md py-2">
                    <div className="font-semibold text-iov-dark-blue">
                        {phase.name} · {formatDateLabel(phase.startDate)} → {formatDateLabel(phase.endDate)}
                    </div>
                    <ul className="list-disc ml-5 space-y-1">
                        {drug.drugs.map((drugName) => (
                            <li key={`${drug.id}-${phase.name}-${drugName}`}>
                                <strong>{drugName}:</strong> {formatDosageValue(phase.dosageByDrug[drugName])} · {formatScheduleValue(phase.scheduleByDrug[drugName])}
                            </li>
                        ))}
                    </ul>
                    {phase.notes && <p className="text-gray-500 mt-1">{phase.notes}</p>}
                </div>
            ))}
        </div>
    );

    const updatePhaseCollection = (
        setter: Dispatch<SetStateAction<Drug[]>>,
        drugId: string,
        phaseIndex: number,
        updater: (phase: DrugPhase, drug: Drug) => DrugPhase,
    ) => {
        setter((prev) =>
            prev.map((drug) => {
                if (drug.id !== drugId) return drug;
                const updatedPhases = drug.phases.map((phase, idx) => (idx === phaseIndex ? updater(phase, drug) : phase));
                return { ...drug, phases: updatedPhases };
            }),
        );
    };

    const updateScheduleField = (
        setter: Dispatch<SetStateAction<Drug[]>>,
        drugId: string,
        phaseIndex: number,
        drugName: string,
        field: 'frequency' | 'times',
        value: DrugScheduleFrequency | string[],
    ) => {
        updatePhaseCollection(setter, drugId, phaseIndex, (phase) => {
            const current = phase.scheduleByDrug[drugName] ?? { frequency: 'DAILY', times: [] };
            const nextSchedule = field === 'frequency' ? { ...current, frequency: value as DrugScheduleFrequency } : { ...current, times: value as string[] };
            return {
                ...phase,
                scheduleByDrug: {
                    ...phase.scheduleByDrug,
                    [drugName]: nextSchedule,
                },
            };
        });
    };

    const updateDosageField = (
        setter: Dispatch<SetStateAction<Drug[]>>,
        drugId: string,
        phaseIndex: number,
        drugName: string,
        field: 'amount' | 'unit',
        value: number | null | DosageUnit | undefined,
    ) => {
        updatePhaseCollection(setter, drugId, phaseIndex, (phase) => {
            const current = phase.dosageByDrug[drugName] ?? { amount: null };
            return {
                ...phase,
                dosageByDrug: {
                    ...phase.dosageByDrug,
                    [drugName]: {
                        ...current,
                        [field]: value,
                    },
                },
            };
        });
    };

    const addPhaseToProtocol = (drugId: string) => {
        setSelectedProtocols((prev) =>
            prev.map((drug) => (drug.id === drugId ? { ...drug, phases: [...drug.phases, createEmptyPhase(drug)] } : drug)),
        );
    };

    const removePhaseFromProtocol = (drugId: string, phaseIndex: number) => {
        setSelectedProtocols((prev) =>
            prev.map((drug) => {
                if (drug.id !== drugId) return drug;
                if (drug.phases.length <= 1) return drug;
                return { ...drug, phases: drug.phases.filter((_, idx) => idx !== phaseIndex) };
            }),
        );
    };

    const handleAddProtocol = () => {
        if (!protocolToAdd) return;
        const template = mockDrugs.find((protocol) => protocol.id === protocolToAdd);
        if (template && !selectedProtocols.some((protocol) => protocol.id === template.id)) {
            setSelectedProtocols([...selectedProtocols, cloneProtocol(template)]);
        }
        setProtocolToAdd('');
    };

    const handleRemoveProtocol = (id: string) => {
        setSelectedProtocols(selectedProtocols.filter((protocol) => protocol.id !== id));
    };

    const renderEditableProtocols = () => {
        if (selectedProtocols.length === 0) {
            return <p className="text-sm text-gray-600">Nessun protocollo selezionato. Aggiungine uno dal catalogo.</p>;
        }

        return (
            <div className="space-y-3">
                {selectedProtocols.map((drug) => (
                    <div key={drug.id} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="font-semibold text-iov-dark-blue">{drug.activePrinciple}</div>
                                <p className="text-xs text-gray-500 capitalize">{drug.regimenType || 'simple'} · ciclo da {drug.cycleDays} giorni</p>
                            </div>
                            <button onClick={() => handleRemoveProtocol(drug.id)} className="text-xs text-red-600 hover:text-red-700" type="button">
                                Rimuovi
                            </button>
                        </div>
                        {drug.phases.map((phase, phaseIdx) => (
                            <div key={`${drug.id}-phase-${phaseIdx}`} className="border rounded-lg p-3 space-y-3 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Nome fase</label>
                                        <input
                                            type="text"
                                            value={phase.name}
                                            onChange={(e) =>
                                                updatePhaseCollection(setSelectedProtocols, drug.id, phaseIdx, (prevPhase) => ({
                                                    ...prevPhase,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Inizio fase</label>
                                        <input
                                            type="date"
                                            value={phase.startDate || ''}
                                            onChange={(e) =>
                                                updatePhaseCollection(setSelectedProtocols, drug.id, phaseIdx, (prevPhase) => ({
                                                    ...prevPhase,
                                                    startDate: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Fine fase</label>
                                        <input
                                            type="date"
                                            value={phase.endDate || ''}
                                            onChange={(e) =>
                                                updatePhaseCollection(setSelectedProtocols, drug.id, phaseIdx, (prevPhase) => ({
                                                    ...prevPhase,
                                                    endDate: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {drug.drugs.map((drugName) => {
                                        const schedule = phase.scheduleByDrug[drugName] ?? { frequency: 'DAILY', times: [] };
                                        const dosage = phase.dosageByDrug[drugName] ?? { amount: null };
                                        return (
                                            <div key={`${drug.id}-${phaseIdx}-${drugName}`} className="bg-white p-3 rounded border">
                                                <div className="font-semibold text-sm mb-2">{drugName}</div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Dosaggio</label>
                                                            <input
                                                                type="number"
                                                                value={dosage.amount ?? ''}
                                                                onChange={(e) => {
                                                                    const rawValue = e.target.value;
                                                                    const parsedValue = rawValue === '' ? null : Number(rawValue);
                                                                    updateDosageField(
                                                                        setSelectedProtocols,
                                                                        drug.id,
                                                                        phaseIdx,
                                                                        drugName,
                                                                        'amount',
                                                                        parsedValue === null || isNaN(parsedValue) ? null : parsedValue,
                                                                    );
                                                                }}
                                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                                                                placeholder="Quantità"
                                                            />
                                                        </div>
                                                        <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Unità</label>
                                                            <select
                                                                value={dosage.unit || ''}
                                                                onChange={(e) =>
                                                                    updateDosageField(
                                                                        setSelectedProtocols,
                                                                        drug.id,
                                                                        phaseIdx,
                                                                        drugName,
                                                                        'unit',
                                                                        (e.target.value as DosageUnit) || undefined,
                                                                    )
                                                                }
                                                                className="w-full px-2 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                                                            >
                                                                <option value="">—</option>
                                                                {dosageUnitOptions.map((unit) => (
                                                                    <option key={unit} value={unit}>
                                                                        {unit}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Frequenza</label>
                                                        <select
                                                            value={schedule.frequency}
                                                            onChange={(e) =>
                                                                updateScheduleField(
                                                                    setSelectedProtocols,
                                                                    drug.id,
                                                                    phaseIdx,
                                                                    drugName,
                                                                    'frequency',
                                                                    e.target.value as DrugScheduleFrequency,
                                                                )
                                                            }
                                                            className="w-full px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-iov-dark-blue text-sm"
                                                        >
                                                            {scheduleFrequencyOptions.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Orari</label>
                                                        <ScheduleTimesEditor
                                                            times={schedule.times}
                                                            onAdd={(time) =>
                                                                updateScheduleField(
                                                                    setSelectedProtocols,
                                                                    drug.id,
                                                                    phaseIdx,
                                                                    drugName,
                                                                    'times',
                                                                    [...schedule.times, time],
                                                                )
                                                            }
                                                            onRemove={(index) =>
                                                                updateScheduleField(
                                                                    setSelectedProtocols,
                                                                    drug.id,
                                                                    phaseIdx,
                                                                    drugName,
                                                                    'times',
                                                                    schedule.times.filter((_, idx) => idx !== index),
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => removePhaseFromProtocol(drug.id, phaseIdx)}
                                        className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                                        disabled={drug.phases.length <= 1}
                                    >
                                        Rimuovi fase
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addPhaseToProtocol(drug.id)}
                            type="button"
                            className="text-sm text-iov-dark-blue hover:text-iov-dark-blue-hover flex items-center gap-1 font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Aggiungi fase
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const handleSubmit = () => {
        // In a real app, this would submit to backend
        alert('Onboarding completato! Richiesta inviata per approvazione.');
        navigate('/farmacista/patients');
    };

    const hasAdministration = diagnosis.administration.oral
        || diagnosis.administration.endovenous
        || diagnosis.administration.subcutaneous
        || Boolean(diagnosis.administration.other);
    const canProceedStep1 =
        patient.name
        && patient.surname
        && patient.birthDate
        && patient.address
        && patient.telephone
        && patient.fiscalCode
        && patient.healthCardNumber
        && caregiver.name
        && caregiver.surname
        && caregiver.telephone
        && emergencyNumbers.guardiaMedica
        && specialistContacts.oncologyConsultation
        && specialistContacts.oncologyUrgency
        && specialistContacts.hospitalPharmacy
        && diagnosis.pathology
        && diagnosis.currentTherapies
        && hasAdministration
        && comorbidities.some((entry) => entry)
        && allergies.some((entry) => entry);
    const canProceedStep2 = selectedProtocols.length > 0 && startDate && endDate;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Onboarding Nuovo Paziente</h1>
                <p className="text-iov-gray-text">Compila la carta d'identità farmacologica e il piano terapeutico</p>
            </div>

            {/* Progress steps */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center w-full">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-iov-dark-blue text-white' : 'bg-gray-200 text-gray-500'}`}>{currentStep > 1 ? <Check className="w-6 h-6" /> : 1}</div>
                            <span className={`mt-2 text-sm font-medium text-center ${currentStep >= 1 ? 'text-iov-dark-blue' : 'text-gray-500'}`}>Carta d'Identità</span>
                        </div>
                        {/* Line 1-2 */}
                        <div className={`flex-1 h-1 ${currentStep > 1 ? 'bg-iov-dark-blue' : 'bg-gray-200'}`}></div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-iov-dark-blue text-white' : 'bg-gray-200 text-gray-500'}`}>{currentStep > 2 ? <Check className="w-6 h-6" /> : 2}</div>
                            <span className={`mt-2 text-sm font-medium text-center ${currentStep >= 2 ? 'text-iov-dark-blue' : 'text-gray-500'}`}>Piano Terapeutico</span>
                        </div>
                        {/* Line 2-3 */}
                        <div className={`flex-1 h-1 ${currentStep > 2 ? 'bg-iov-dark-blue' : 'bg-gray-200'}`}></div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-iov-dark-blue text-white' : 'bg-gray-200 text-gray-500'}`}>{3}</div>
                            <span className={`mt-2 text-sm font-medium text-center ${currentStep >= 3 ? 'text-iov-dark-blue' : 'text-gray-500'}`}>Revisione</span>
                        </div>
                    </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Data di nascita *</label>
                                    <input
                                        type="date"
                                        value={patient.birthDate}
                                        onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
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
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">N° Tessera Sanitaria (TEAM) *</label>
                                    <input
                                        type="text"
                                        value={patient.healthCardNumber}
                                        onChange={(e) => setPatient({ ...patient, healthCardNumber: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="8038001234567890"
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

                        {/* Emergency Numbers */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Numeri Telefonici di Emergenza</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Soccorso Pubblico</label>
                                    <input
                                        type="text"
                                        value={emergencyNumbers.publicSafety}
                                        readOnly
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Emergenza Sanitaria</label>
                                    <input
                                        type="text"
                                        value={emergencyNumbers.healthEmergency}
                                        readOnly
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">N.U.E.</label>
                                    <input
                                        type="text"
                                        value={emergencyNumbers.nue}
                                        readOnly
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Guardia Medica *</label>
                                    <input
                                        type="text"
                                        value={emergencyNumbers.guardiaMedica}
                                        onChange={(e) => setEmergencyNumbers({ ...emergencyNumbers, guardiaMedica: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="116117"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specialist Contacts */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Contatti Specialisti e Farmacia Ospedaliera</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Specialista (Consulenze) *</label>
                                    <input
                                        type="text"
                                        value={specialistContacts.oncologyConsultation}
                                        onChange={(e) => setSpecialistContacts({ ...specialistContacts, oncologyConsultation: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Telefono consulenze"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Specialista (Urgenze) *</label>
                                    <input
                                        type="text"
                                        value={specialistContacts.oncologyUrgency}
                                        onChange={(e) => setSpecialistContacts({ ...specialistContacts, oncologyUrgency: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Telefono urgenze"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Farmacia ospedaliera *</label>
                                    <input
                                        type="text"
                                        value={specialistContacts.hospitalPharmacy}
                                        onChange={(e) => setSpecialistContacts({ ...specialistContacts, hospitalPharmacy: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Telefono farmacia"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Oncology Diagnosis */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Diagnosi Oncologica</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Patologia *</label>
                                    <input
                                        type="text"
                                        value={diagnosis.pathology}
                                        onChange={(e) => setDiagnosis({ ...diagnosis, pathology: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        placeholder="Patologia"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Terapie oncologiche attuali *</label>
                                    <textarea
                                        value={diagnosis.currentTherapies}
                                        onChange={(e) => setDiagnosis({ ...diagnosis, currentTherapies: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        rows={2}
                                        placeholder="Descrivere le terapie attuali"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-iov-gray-text mb-2">Modalita di somministrazione *</label>
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-2 text-sm text-iov-gray-text">
                                            <input
                                                type="checkbox"
                                                checked={diagnosis.administration.oral}
                                                onChange={(e) =>
                                                    setDiagnosis({
                                                        ...diagnosis,
                                                        administration: { ...diagnosis.administration, oral: e.target.checked },
                                                    })
                                                }
                                                className="h-4 w-4"
                                            />
                                            Orale
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-iov-gray-text">
                                            <input
                                                type="checkbox"
                                                checked={diagnosis.administration.endovenous}
                                                onChange={(e) =>
                                                    setDiagnosis({
                                                        ...diagnosis,
                                                        administration: { ...diagnosis.administration, endovenous: e.target.checked },
                                                    })
                                                }
                                                className="h-4 w-4"
                                            />
                                            Endovena
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-iov-gray-text">
                                            <input
                                                type="checkbox"
                                                checked={diagnosis.administration.subcutaneous}
                                                onChange={(e) =>
                                                    setDiagnosis({
                                                        ...diagnosis,
                                                        administration: { ...diagnosis.administration, subcutaneous: e.target.checked },
                                                    })
                                                }
                                                className="h-4 w-4"
                                            />
                                            Sottocute
                                        </label>
                                        <div className="flex items-center gap-2 text-sm text-iov-gray-text">
                                            <span>Altro:</span>
                                            <input
                                                type="text"
                                                value={diagnosis.administration.other || ''}
                                                onChange={(e) =>
                                                    setDiagnosis({
                                                        ...diagnosis,
                                                        administration: { ...diagnosis.administration, other: e.target.value },
                                                    })
                                                }
                                                className="px-3 py-1 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none text-sm"
                                                placeholder="Specificare"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comorbidities */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Comorbidita Principali *</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {comorbidities.map((value, index) => (
                                    <div key={`comorbidity-${index}`}>
                                        <label className="block text-sm font-medium text-iov-gray-text mb-2">Comorbidita {index + 1}</label>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const next = [...comorbidities];
                                                next[index] = e.target.value;
                                                setComorbidities(next);
                                            }}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                            placeholder="Inserisci comorbidita"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="border-t-2 border-iov-light-blue pt-6">
                            <h3 className="text-lg font-semibold text-iov-dark-blue mb-4">Allergie Note *</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allergies.map((value, index) => (
                                    <div key={`allergy-${index}`}>
                                        <label className="block text-sm font-medium text-iov-gray-text mb-2">Allergia {index + 1}</label>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const next = [...allergies];
                                                next[index] = e.target.value;
                                                setAllergies(next);
                                            }}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                            placeholder="Inserisci allergia"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Therapy Plan */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-iov-dark-blue mb-4">Piano Terapeutico</h2>

                        {/* Protocols */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-iov-dark-blue">Protocolli terapeutici</h3>
                            </div>
                            <div className="bg-iov-light-blue p-4 rounded-lg space-y-4">
                                {renderEditableProtocols()}
                                <div>
                                    <label className="block text-sm font-medium text-iov-dark-blue-text mb-2">
                                        Seleziona protocollo dal catalogo
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <select
                                            value={protocolToAdd}
                                            onChange={(e) => setProtocolToAdd(e.target.value)}
                                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none text-sm"
                                        >
                                            <option value="">Seleziona un protocollo</option>
                                            {mockDrugs.map((protocol) => (
                                                <option key={protocol.id} value={protocol.id}>
                                                    {protocol.activePrinciple} · {protocol.regimenType}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAddProtocol}
                                            disabled={!protocolToAdd}
                                            className="bg-iov-dark-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Aggiungi
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                    <strong>Data di nascita:</strong> {patient.birthDate}
                                </p>
                                <p>
                                    <strong>Indirizzo:</strong> {patient.address}
                                </p>
                                <p>
                                    <strong>Telefono:</strong> {patient.telephone}
                                </p>
                                <p>
                                    <strong>N° Tessera Sanitaria (TEAM):</strong> {patient.healthCardNumber}
                                </p>
                                <p>
                                    <strong>Codice Fiscale:</strong> {patient.fiscalCode}
                                </p>
                                <p>
                                    <strong>Caregiver:</strong> {caregiver.name} {caregiver.surname} - {caregiver.telephone}
                                </p>
                                <p>
                                    <strong>Guardia Medica:</strong> {emergencyNumbers.guardiaMedica}
                                </p>
                                <p>
                                    <strong>Specialista (Consulenze):</strong> {specialistContacts.oncologyConsultation}
                                </p>
                                <p>
                                    <strong>Specialista (Urgenze):</strong> {specialistContacts.oncologyUrgency}
                                </p>
                                <p>
                                    <strong>Farmacia ospedaliera:</strong> {specialistContacts.hospitalPharmacy}
                                </p>
                                <p>
                                    <strong>Diagnosi:</strong> {diagnosis.pathology}
                                </p>
                                <p>
                                    <strong>Terapie oncologiche attuali:</strong> {diagnosis.currentTherapies}
                                </p>
                                <p>
                                    <strong>Somministrazione:</strong>{' '}
                                    {[
                                        diagnosis.administration.oral ? 'Orale' : null,
                                        diagnosis.administration.endovenous ? 'Endovena' : null,
                                        diagnosis.administration.subcutaneous ? 'Sottocute' : null,
                                        diagnosis.administration.other ? `Altro (${diagnosis.administration.other})` : null,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                                <p>
                                    <strong>Comorbidita:</strong> {comorbidities.filter((entry) => entry).join(', ')}
                                </p>
                                <p>
                                    <strong>Allergie:</strong> {allergies.filter((entry) => entry).join(', ')}
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
                                    <strong className="text-sm">Protocolli selezionati:</strong>
                                    <div className="mt-2 space-y-2">
                                        {selectedProtocols.map((protocol, index) => (
                                            <div key={protocol.id} className="bg-white p-3 rounded-lg text-sm space-y-1">
                                                <strong>Protocollo {index + 1}:</strong> {protocol.activePrinciple}
                                                <div className="text-xs text-gray-600">{formatDrugDosage(protocol)}</div>
                                                <div className="text-xs text-gray-600">{formatDrugSchedule(protocol)}</div>
                                                {renderPhaseDetails(protocol)}
                                            </div>
                                        ))}
                                    </div>
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
