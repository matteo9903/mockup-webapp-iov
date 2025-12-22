import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, Bell, Plus } from 'lucide-react';
import {
    mockPatients,
    mockDrugs,
    mockQuestionnaireAnswers,
    mockQuestionnaires,
    mockSatisfactionQuestions,
    mockNewTherapiesQuestions,
    mockMedicationIntakeQuestions,
} from '../../data/mockData.ts';
import {
    Drug,
    DrugPhase,
    DrugSchedule,
    DrugDosage,
    DosageUnit,
    DrugScheduleFrequency,
    TherapyPlan,
    TherapyPlanHistoryEntry,
} from '../../types/index';
import { formatDrugDosage, formatDrugSchedule, formatDosageValue, formatScheduleValue } from '../../utils/drugFormat.ts';
import QuestionnaireList from '../common/QuestionnaireList.tsx';
import NotificationsList from '../common/NotificationsList.tsx';

type Tab = 'info' | 'questionnaires' | 'notifications';

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
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);
    const end = endDate.toISOString().split('T')[0];
    return { start, end };
};

const getQuestionsForQuestionnaire = (questionnaireId?: string) => {
    switch (questionnaireId) {
        case 'q1':
            return mockSatisfactionQuestions;
        case 'q2':
            return mockNewTherapiesQuestions;
        case 'q3':
            return mockMedicationIntakeQuestions;
        default:
            return [];
    }
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

function PatientDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('info');
    const [isEditingTherapy, setIsEditingTherapy] = useState(false);
    const [editedStartDate, setEditedStartDate] = useState('');
    const [editedEndDate, setEditedEndDate] = useState('');
    const [editedDrugs, setEditedDrugs] = useState<Drug[]>([]);
    const [protocolToAdd, setProtocolToAdd] = useState('');
    const [editedStatus, setEditedStatus] = useState<'Attivo' | 'Non Attivo'>('Attivo');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [originalStatus, setOriginalStatus] = useState<'Attivo' | 'Non Attivo'>('Attivo');
    const [isExpandedNewTherapy, setIsExpandedNewTherapy] = useState(false);
    const [newTherapyStart, setNewTherapyStart] = useState('');
    const [newTherapyEnd, setNewTherapyEnd] = useState('');
    const [newTherapyDrugs, setNewTherapyDrugs] = useState<Drug[]>([]);
    const [newProtocolToAdd, setNewProtocolToAdd] = useState('');
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(null);
    const questionnaireAnswersRef = useRef<HTMLDivElement | null>(null);

    const patient = mockPatients.find((p) => p.id === id);
    const [therapyPlan, setTherapyPlan] = useState<TherapyPlan | undefined>(patient?.therapyPlan);
    const therapyHistory: TherapyPlanHistoryEntry[] = patient?.therapyHistory ?? [];
    const availableProtocols = mockDrugs;
    const patientQuestionnaireAnswers = mockQuestionnaireAnswers
        .filter((entry) => entry.patientId === patient?.id)
        .sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime());
    const filteredQuestionnaireAnswers = selectedQuestionnaireId
        ? patientQuestionnaireAnswers.filter((entry) => entry.questionnaireId === selectedQuestionnaireId)
        : patientQuestionnaireAnswers;
    const selectedQuestionnaireLabel = selectedQuestionnaireId
        ? mockQuestionnaires.find((questionnaire) => questionnaire.id === selectedQuestionnaireId)?.title
        : null;
    const answerLabels: Record<0 | 1 | 2, string> = {
        0: 'Per niente',
        1: 'Medio',
        2: 'Alto',
    };
    const formatAnswerValue = (value?: 0 | 1 | 2 | string | string[]) => {
        if (value === undefined) {
            return '—';
        }
        if (Array.isArray(value)) {
            return value.length ? value.join(', ') : '—';
        }
        if (typeof value === 'string') {
            return value || '—';
        }
        return value + ' (' + answerLabels[value] + ')';
    };
    const handleViewAnswers = (questionnaireId: string) => {
        setSelectedQuestionnaireId(questionnaireId);
        window.setTimeout(() => {
            questionnaireAnswersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

    if (!patient) {
        return (
            <div className="text-center py-12">
                <p className="text-iov-gray-text text-lg">Paziente non trovato</p>
                <button
                    onClick={() => navigate('/farmacista/patients')}
                    className="mt-4 text-iov-dark-blue hover:underline"
                >
                    Torna alla lista pazienti
                </button>
            </div>
        );
    }

    const renderPhaseDetails = (drug: Drug) => (
        <div className="mt-3 space-y-2 text-xs text-gray-600">
            {drug.phases.map((phase, idx) => (
                <div
                    key={`${drug.id}-${phase.name}-${idx}`}
                    className="border-l-2 border-iov-light-blue pl-3 bg-gray-50 rounded-md py-2"
                >
                    <div className="font-semibold text-iov-dark-blue">
                        {phase.name} · {formatDateLabel(phase.startDate)} → {formatDateLabel(phase.endDate)}
                    </div>
                    <ul className="list-disc ml-5 space-y-1">
                        {drug.drugs.map((drugName) => (
                            <li key={`${drug.id}-${phase.name}-${drugName}`}>
                                <strong>{drugName}:</strong> {formatDosageValue(phase.dosageByDrug[drugName])} ·{' '}
                                {formatScheduleValue(phase.scheduleByDrug[drugName])}
                            </li>
                        ))}
                    </ul>
                    {phase.notes && <p className="text-gray-500 mt-1">{phase.notes}</p>}
                </div>
            ))}
        </div>
    );

    const updatePhaseCollection = (
        setter: React.Dispatch<React.SetStateAction<Drug[]>>,
        drugId: string,
        phaseIndex: number,
        updater: (phase: DrugPhase, drug: Drug) => DrugPhase,
    ) => {
        setter((prev) =>
            prev.map((drug) => {
                if (drug.id !== drugId) {
                    return drug;
                }
                const updatedPhases = drug.phases.map((phase, idx) => (idx === phaseIndex ? updater(phase, drug) : phase));
                return { ...drug, phases: updatedPhases };
            }),
        );
    };

    const updateScheduleField = (
        setter: React.Dispatch<React.SetStateAction<Drug[]>>,
        drugId: string,
        phaseIndex: number,
        drugName: string,
        field: 'frequency' | 'times',
        value: DrugScheduleFrequency | string[],
    ) => {
        updatePhaseCollection(setter, drugId, phaseIndex, (phase) => {
            const existingSchedule = phase.scheduleByDrug[drugName] ?? { frequency: 'DAILY', times: [] };
            const updatedSchedule =
                field === 'frequency'
                    ? { ...existingSchedule, frequency: value as DrugScheduleFrequency }
                    : { ...existingSchedule, times: value as string[] };
            return {
                ...phase,
                scheduleByDrug: {
                    ...phase.scheduleByDrug,
                    [drugName]: updatedSchedule,
                },
            };
        });
    };

    const updateDosageField = (
        setter: React.Dispatch<React.SetStateAction<Drug[]>>,
        drugId: string,
        phaseIndex: number,
        drugName: string,
        field: 'amount' | 'unit',
        value: number | null | DosageUnit | undefined,
    ) => {
        updatePhaseCollection(setter, drugId, phaseIndex, (phase) => {
            const existingDosage = phase.dosageByDrug[drugName] ?? { amount: null };
            const normalizedValue = field === 'amount' ? (value as number | null) : value;
            return {
                ...phase,
                dosageByDrug: {
                    ...phase.dosageByDrug,
                    [drugName]: {
                        ...existingDosage,
                        [field]: normalizedValue,
                    },
                },
            };
        });
    };

    const addPhaseToDrug = (setter: React.Dispatch<React.SetStateAction<Drug[]>>, drugId: string) => {
        setter((prev) =>
            prev.map((drug) => (drug.id === drugId ? { ...drug, phases: [...drug.phases, createEmptyPhase(drug)] } : drug)),
        );
    };

    const removePhaseFromDrug = (setter: React.Dispatch<React.SetStateAction<Drug[]>>, drugId: string, phaseIndex: number) => {
        setter((prev) =>
            prev.map((drug) => {
                if (drug.id !== drugId) {
                    return drug;
                }
                if (drug.phases.length <= 1) {
                    return drug;
                }
                const updatedPhases = drug.phases.filter((_, idx) => idx !== phaseIndex);
                return { ...drug, phases: updatedPhases };
            }),
        );
    };

    const renderEditableProtocols = (
        drugs: Drug[],
        setDrugsState: React.Dispatch<React.SetStateAction<Drug[]>>,
        onRemove: (id: string) => void,
        colorClasses?: { heading: string },
    ) => {
        if (drugs.length === 0) {
            return <p className="text-sm text-gray-600">Nessun protocollo selezionato.</p>;
        }

        return (
            <div className="space-y-3">
                {drugs.map((drug) => (
                    <div key={drug.id} className="bg-white p-3 rounded-lg space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className={`font-medium ${colorClasses?.heading ?? 'text-iov-dark-blue'}`}>{drug.activePrinciple}</div>
                                <p className="text-xs text-gray-500 capitalize">
                                    {drug.regimenType || 'simple'} · ciclo da {drug.cycleDays} giorni
                                </p>
                            </div>
                            <button
                                onClick={() => onRemove(drug.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                                type="button"
                            >
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
                                                updatePhaseCollection(setDrugsState, drug.id, phaseIdx, (prevPhase) => ({
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
                                                updatePhaseCollection(setDrugsState, drug.id, phaseIdx, (prevPhase) => ({
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
                                                updatePhaseCollection(setDrugsState, drug.id, phaseIdx, (prevPhase) => ({
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
                                                                        setDrugsState,
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
                                                                        setDrugsState,
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
                                                                    setDrugsState,
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
                                                                    setDrugsState,
                                                                    drug.id,
                                                                    phaseIdx,
                                                                    drugName,
                                                                    'times',
                                                                    [...schedule.times, time],
                                                                )
                                                            }
                                                            onRemove={(index) =>
                                                                updateScheduleField(
                                                                    setDrugsState,
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
                                        onClick={() => removePhaseFromDrug(setDrugsState, drug.id, phaseIdx)}
                                        className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                                        disabled={drug.phases.length <= 1}
                                    >
                                        Rimuovi fase
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addPhaseToDrug(setDrugsState, drug.id)}
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

    const handleAddEditedProtocol = () => {
        if (!protocolToAdd) return;
        const selected = availableProtocols.find((protocol) => protocol.id === protocolToAdd);
        if (selected && !editedDrugs.some((drug) => drug.id === selected.id)) {
            setEditedDrugs([...editedDrugs, cloneProtocol(selected)]);
        }
        setProtocolToAdd('');
    };

    const handleRemoveEditedProtocol = (idToRemove: string) => {
        setEditedDrugs(editedDrugs.filter((drug) => drug.id !== idToRemove));
    };

    const handleAddNewProtocol = () => {
        if (!newProtocolToAdd) return;
        const selected = availableProtocols.find((protocol) => protocol.id === newProtocolToAdd);
        if (selected && !newTherapyDrugs.some((drug) => drug.id === selected.id)) {
            setNewTherapyDrugs([...newTherapyDrugs, cloneProtocol(selected)]);
        }
        setNewProtocolToAdd('');
    };

    const handleRemoveNewProtocol = (idToRemove: string) => {
        setNewTherapyDrugs(newTherapyDrugs.filter((drug) => drug.id !== idToRemove));
    };

    const applyTherapyChanges = () => {
        if (!therapyPlan) return;
        setTherapyPlan({
            ...therapyPlan,
            startDate: editedStartDate ? new Date(editedStartDate) : therapyPlan.startDate,
            endDate: editedEndDate ? new Date(editedEndDate) : therapyPlan.endDate,
            drugs: editedDrugs,
            updatedAt: new Date(),
        });
        setShowConfirmDialog(false);
        setIsEditingTherapy(false);
        setOriginalStatus(editedStatus);
    };

    const handleRegisterNewTherapy = () => {
        if (!newTherapyStart || !newTherapyEnd || newTherapyDrugs.length === 0) {
            return;
        }
        const newPlan: TherapyPlan = {
            id: `tp-${Date.now()}`,
            patientId: patient.id,
            drugs: newTherapyDrugs.map(cloneProtocol),
            startDate: new Date(newTherapyStart),
            endDate: new Date(newTherapyEnd),
            createdAt: new Date(),
            updatedAt: new Date(),
            approvalStatus: 'pending',
        };
        setTherapyPlan(newPlan);
        setIsExpandedNewTherapy(false);
        setNewTherapyDrugs([]);
        setNewTherapyStart('');
        setNewTherapyEnd('');
        setNewProtocolToAdd('');
    };

    const tabs = [
        { id: 'info' as Tab, label: 'Informazioni', icon: User },
        { id: 'questionnaires' as Tab, label: 'Questionari', icon: FileText },
        { id: 'notifications' as Tab, label: 'Notifiche', icon: Bell },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/farmacista/patients')}
                    className="mb-4 flex items-center gap-2 text-iov-dark-blue hover:text-iov-dark-blue-hover transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Torna alla lista</span>
                </button>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-iov-light-blue w-20 h-20 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-iov-dark-blue-text" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">
                                {patient.name} {patient.surname}
                            </h1>
                            <div className="flex items-center gap-4">
                            <span className="bg-iov-light-blue px-3 py-1 rounded-full text-iov-dark-blue-text font-medium text-sm capitalize">
                                Unità: {patient.unitaOperativa}
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-t-xl shadow-md">
                <div className="flex border-b-2 border-gray-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-4 ${activeTab === tab.id
                                    ? 'text-iov-dark-blue border-iov-dark-blue'
                                    : 'text-iov-gray-text border-transparent hover:text-iov-dark-blue hover:border-iov-light-blue'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-b-xl shadow-md p-6">
                {activeTab === 'info' && (
                    <div className="space-y-6">
                        {patient.idCard && (
                            <>
                                {/* Pharmacological ID Card */}
                                <div className="bg-iov-light-blue p-6 rounded-lg">
                                    <h2 className="text-xl font-bold text-iov-dark-blue-text mb-4">Carta d'Identità Farmacologica</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong>Nome:</strong> {patient.idCard.patient.name}
                                        </div>
                                        <div>
                                            <strong>Cognome:</strong> {patient.idCard.patient.surname}
                                        </div>
                                        <div className="md:col-span-2">
                                            <strong>Indirizzo:</strong> {patient.idCard.patient.address}
                                        </div>
                                        <div>
                                            <strong>Telefono:</strong> {patient.idCard.patient.telephone}
                                        </div>
                                        <div>
                                            <strong>Codice Fiscale:</strong> {patient.idCard.patient.fiscalCode}
                                        </div>
                                        <div className="md:col-span-2 border-t-2 border-white pt-4 mt-2">
                                            <strong className="block mb-2">Caregiver:</strong>
                                            <div className="ml-4">
                                                {patient.idCard.caregiver.name} {patient.idCard.caregiver.surname} -{' '}
                                                {patient.idCard.caregiver.telephone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Therapy Plan */}
                                {therapyPlan && (
                                    <div className="bg-iov-pink p-6 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-iov-pink-text">Piano Terapeutico Attivo</h2>
                                            {!isEditingTherapy && (
                                                <button
                                                    onClick={() => {
                                                        setIsEditingTherapy(true);
                                                        setEditedStartDate(new Date(therapyPlan.startDate).toISOString().split('T')[0]);
                                                        setEditedEndDate(new Date(therapyPlan.endDate).toISOString().split('T')[0]);
                                                        setEditedDrugs(therapyPlan.drugs.map(cloneProtocol));
                                                        setProtocolToAdd('');
                                                        setOriginalStatus('Attivo');
                                                        setEditedStatus('Attivo');
                                                    }}
                                                    className="bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                                >
                                                    Modifica
                                                </button>
                                            )}
                                        </div>
                                        {isEditingTherapy ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-iov-pink-text mb-2">Data Inizio</label>
                                                        <input
                                                            type="date"
                                                            value={editedStartDate}
                                                            onChange={(e) => setEditedStartDate(e.target.value)}
                                                            className="w-full px-3 py-2 border-2 border-iov-pink-border rounded-lg focus:outline-none focus:border-iov-dark-blue"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-iov-pink-text mb-2">Data Fine</label>
                                                        <input
                                                            type="date"
                                                            value={editedEndDate}
                                                            onChange={(e) => setEditedEndDate(e.target.value)}
                                                            className="w-full px-3 py-2 border-2 border-iov-pink-border rounded-lg focus:outline-none focus:border-iov-dark-blue"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-iov-pink-text mb-2">Stato</label>
                                                    <select
                                                        value={editedStatus}
                                                        onChange={(e) => setEditedStatus(e.target.value as 'Attivo' | 'Non Attivo')}
                                                        className="w-full px-3 py-2 border-2 border-iov-pink-border rounded-lg focus:outline-none focus:border-iov-dark-blue"
                                                    >
                                                        <option value="Attivo">Attivo</option>
                                                        <option value="Non Attivo">Non Attivo</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <strong className="block mb-2 text-iov-pink-text">Protocolli selezionati:</strong>
                                                    {renderEditableProtocols(editedDrugs, setEditedDrugs, handleRemoveEditedProtocol, {
                                                        heading: 'text-iov-pink-text',
                                                    })}
                                                    <div className="mt-4">
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Aggiungi protocollo dal catalogo
                                                        </label>
                                                        <div className="flex flex-col md:flex-row gap-2">
                                                            <select
                                                                value={protocolToAdd}
                                                                onChange={(e) => setProtocolToAdd(e.target.value)}
                                                                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none text-sm"
                                                            >
                                                                <option value="">Seleziona un protocollo</option>
                                                                {availableProtocols.map((protocol) => (
                                                                    <option key={protocol.id} value={protocol.id}>
                                                                        {protocol.activePrinciple} · {protocol.regimenType}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                onClick={handleAddEditedProtocol}
                                                                className="bg-iov-dark-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                                                disabled={!protocolToAdd}
                                                                type="button"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Aggiungi
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (editedStatus !== originalStatus) {
                                                                setShowConfirmDialog(true);
                                                            } else {
                                                                applyTherapyChanges();
                                                            }
                                                        }}
                                                        className="flex-1 bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                                    >
                                                        Salva
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingTherapy(false)}
                                                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                                    >
                                                        Annulla
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <strong>Data Inizio:</strong> {new Date(therapyPlan.startDate).toLocaleDateString('it-IT')}
                                                    </div>
                                                    <div>
                                                        <strong>Data Fine:</strong> {new Date(therapyPlan.endDate).toLocaleDateString('it-IT')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong className="block mb-2">Farmaci:</strong>
                                                    <div className="space-y-2">
                                                        {therapyPlan.drugs.map((drug: Drug) => (
                                                            <div key={drug.id} className="bg-white p-3 rounded-lg text-sm space-y-1">
                                                                <strong>{drug.activePrinciple}</strong>
                                                                <div className="text-xs text-gray-600">{formatDrugDosage(drug)}</div>
                                                                <div className="text-xs text-gray-600">{formatDrugSchedule(drug)}</div>
                                                                {renderPhaseDetails(drug)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Add New Therapy Plan */}
                                <div className="bg-iov-yellow p-6 rounded-lg">
                                    <button
                                        onClick={() => setIsExpandedNewTherapy(!isExpandedNewTherapy)}
                                        className="w-full flex items-center justify-between mb-4 hover:opacity-90 transition-opacity"
                                    >
                                        <h2 className="text-xl font-bold text-iov-yellow-text">Aggiungi Nuovo Piano Terapeutico</h2>
                                        <span className="text-2xl text-iov-yellow-text">{isExpandedNewTherapy ? '−' : '+'}</span>
                                    </button>
                                    {isExpandedNewTherapy && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-iov-yellow-text mb-2">Data Inizio</label>
                                                    <input
                                                        type="date"
                                                        value={newTherapyStart}
                                                        onChange={(e) => setNewTherapyStart(e.target.value)}
                                                        className="w-full px-3 py-2 border-2 border-iov-yellow-dark rounded-lg focus:outline-none focus:border-iov-dark-blue"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-iov-yellow-text mb-2">Data Fine</label>
                                                    <input
                                                        type="date"
                                                        value={newTherapyEnd}
                                                        onChange={(e) => setNewTherapyEnd(e.target.value)}
                                                        className="w-full px-3 py-2 border-2 border-iov-yellow-dark rounded-lg focus:outline-none focus:border-iov-dark-blue"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-iov-yellow-text mb-2">Protocolli da includere</label>
                                                {renderEditableProtocols(newTherapyDrugs, setNewTherapyDrugs, handleRemoveNewProtocol, {
                                                    heading: 'text-iov-yellow-text',
                                                })}
                                                <div className="mt-4">
                                                    <label className="block text-xs font-medium text-iov-yellow-text mb-1">
                                                        Seleziona protocollo da aggiungere
                                                    </label>
                                                    <div className="flex flex-col md:flex-row gap-2">
                                                        <select
                                                            value={newProtocolToAdd}
                                                            onChange={(e) => setNewProtocolToAdd(e.target.value)}
                                                            className="flex-1 px-3 py-2 border-2 border-iov-yellow-dark rounded-lg focus:border-iov-dark-blue focus:outline-none text-sm"
                                                        >
                                                            <option value="">Scegli dalla libreria</option>
                                                            {availableProtocols.map((protocol) => (
                                                                <option key={protocol.id} value={protocol.id}>
                                                                    {protocol.activePrinciple} · {protocol.regimenType}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={handleAddNewProtocol}
                                                            type="button"
                                                            className="bg-iov-yellow-text text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                                            disabled={!newProtocolToAdd}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Aggiungi protocollo
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="w-full bg-iov-yellow-text text-white font-medium px-4 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                                disabled={!newTherapyStart || !newTherapyEnd || newTherapyDrugs.length === 0}
                                                type="button"
                                                onClick={handleRegisterNewTherapy}
                                            >
                                                Registra Piano Terapeutico
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Therapy plan history */}
                                <div className="bg-gray-100 p-6 rounded-lg">
                                    <h2 className="text-xl font-bold text-iov-dark-blue mb-4">Storico Piani Terapeutici Disattivati</h2>
                                    {therapyHistory.length === 0 ? (
                                        <p className="text-sm text-gray-600">Nessun piano terapeutico disattivato registrato.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {therapyHistory.map((entry) => (
                                                <div key={entry.plan.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                        <div>
                                                            <p className="text-sm font-semibold text-iov-dark-blue">
                                                                {entry.plan.drugs.map((drug) => drug.activePrinciple).join(', ')}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                Inizio:{' '}
                                                                {entry.plan.startDate.toLocaleDateString('it-IT')} · Fine:{' '}
                                                                {entry.plan.endDate.toLocaleDateString('it-IT')}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full inline-flex items-center justify-center">
                                                            Disattivato il {entry.deactivatedAt.toLocaleDateString('it-IT')}
                                                        </span>
                                                    </div>
                                                    {entry.deactivationReason && (
                                                        <p className="text-xs text-gray-500 mt-2 italic">{entry.deactivationReason}</p>
                                                    )}
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {entry.plan.drugs.map((drug) => (
                                                            <div
                                                                key={`${entry.plan.id}-${drug.id}`}
                                                                className="border rounded-md p-3 bg-gray-50"
                                                            >
                                                                <p className="text-sm font-semibold text-iov-dark-blue">{drug.activePrinciple}</p>
                                                                <p className="text-xs text-gray-600">{formatDrugDosage(drug)}</p>
                                                                <p className="text-xs text-gray-600">{formatDrugSchedule(drug)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'questionnaires' && (
                    <div className="space-y-6">
                        <QuestionnaireList patientId={patient.id} onViewAnswers={handleViewAnswers} />
                        <div ref={questionnaireAnswersRef} className="bg-gray-100 p-6 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-iov-dark-blue">Risposte questionari</h2>
                                    {selectedQuestionnaireLabel && (
                                        <p className="text-xs text-iov-dark-blue">Filtro: {selectedQuestionnaireLabel}</p>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500">Legenda intensita: 0 = Per niente, 1 = Medio, 2 = Alto</span>
                            </div>
                            {filteredQuestionnaireAnswers.length === 0 ? (
                                <p className="text-sm text-gray-600">Nessuna risposta disponibile per questo paziente.</p>
                            ) : (
                                <div className="space-y-4">
                                    {filteredQuestionnaireAnswers.map((entry) => {
                                        const questionnaire = mockQuestionnaires.find((q) => q.id === entry.questionnaireId);
                                        const questions = getQuestionsForQuestionnaire(entry.questionnaireId);
                                        const responseCount = Object.keys(entry.answers).length;

                                        return (
                                            <div key={entry.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-iov-dark-blue">
                                                            {questionnaire?.title ?? 'Questionario'}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Compilato il {entry.answeredAt.toLocaleDateString('it-IT')}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                                        {responseCount} risposte
                                                    </span>
                                                </div>
                                                <div className="mt-3 space-y-3">
                                                    {(questions.length ? questions : Object.keys(entry.answers).map((id) => ({ id, text: id }))).map(
                                                        (question, index) => {
                                                            const value = entry.answers[question.id];
                                                            return (
                                                                <div
                                                                    key={`${entry.id}-${question.id}`}
                                                                    className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 border-b border-dashed border-gray-200 pb-2 last:border-b-0 last:pb-0"
                                                                >
                                                                    <p className="text-sm text-gray-700">
                                                                        {index + 1}. {question.text}
                                                                    </p>
                                                                    <span className="text-sm font-semibold text-iov-dark-blue">
                                                                        {formatAnswerValue(value)}
                                                                    </span>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && <NotificationsList patientId={patient.id} />}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
                        <h3 className="text-lg font-bold text-iov-dark-blue mb-4">Conferma Cambio Stato</h3>
                        <p className="text-iov-gray-text mb-6">
                            Sei sicuro di voler cambiare lo stato del piano terapeutico da <strong>{originalStatus}</strong> a <strong>{editedStatus}</strong>?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={applyTherapyChanges}
                                className="flex-1 bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                Sì, Conferma
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setEditedStatus(originalStatus);
                                }}
                                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                No, Annulla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientDetail;
