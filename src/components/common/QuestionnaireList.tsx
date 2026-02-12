import { useEffect, useState } from 'react';
import { FileText, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
// import { Edit2 } from 'lucide-react'; // Edit functionality disabled
import LoadTemplate from './LoadTemplate';
import { Questionnaire, QuestionnaireAnswerOption, QuestionnaireGroup, QuestionnaireQuestion } from '../../types/index';

interface QuestionnaireListProps {
    showAll?: boolean;
    onViewAnswers?: (questionnaireId: string) => void;
}

interface ApiQuestionnaireOption {
    optionId?: number | null;
    text?: string;
    displayOrder?: number;
}

interface ApiQuestionnaireQuestion {
    questionId?: number | null;
    text?: string;
    type?: string;
    required?: boolean;
    displayOrder?: number;
    options?: ApiQuestionnaireOption[];
}

interface ApiQuestionnaireGroup {
    groupId?: number | null;
    title?: string;
    displayOrder?: number;
    legend?: ApiQuestionnaireOption[];
    questions?: ApiQuestionnaireQuestion[];
}

interface ApiQuestionnaireTemplate {
    templateId: number;
    title: string;
    description?: string;
    status?: boolean;
    frequency?: {
        frequency?: string;
        number?: number | null;
    };
    groups?: ApiQuestionnaireGroup[];
}

function QuestionnaireList({ showAll = false, onViewAnswers }: QuestionnaireListProps) {
    // const [editingId, setEditingId] = useState<string | null>(null);
    // const [frequency, setFrequency] = useState('');

    // State for template modal
    const [templateModal, setTemplateModal] = useState<{
        isOpen: boolean;
        questionnaire?: Questionnaire | null;
    }>({ isOpen: false, questionnaire: null });

    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

    const formatFrequency = (frequency?: { frequency?: string; number?: number | null }): string => {
        if (!frequency?.frequency) {
            return 'non definita';
        }

        const map: Record<string, string> = {
            daily: 'giornaliero',
            weekly: 'settimanale',
            monthly: 'mensile',
            una_tantum: 'una tantum',
            custom: 'personalizzato',
        };

        const label = map[frequency.frequency] ?? frequency.frequency;

        if (frequency.frequency === 'custom' && frequency.number) {
            return `ogni ${frequency.number} giorni`;
        }

        return label;
    };

    const mapOptions = (options?: ApiQuestionnaireOption[]): QuestionnaireAnswerOption[] =>
        (options ?? []).map((option, index) => ({
            id: String(option.optionId ?? `${option.text ?? 'opzione'}-${index}`),
            text: option.text ?? '',
            displayOrder: option.displayOrder ?? 0,
        }));

    const mapQuestions = (questions?: ApiQuestionnaireQuestion[]): QuestionnaireQuestion[] =>
        (questions ?? []).map((question, index) => ({
            id: String(question.questionId ?? `${question.text ?? 'domanda'}-${index}`),
            text: question.text ?? '',
            type: question.type ?? 'text',
            required: question.required ?? false,
            displayOrder: question.displayOrder ?? 0,
            options: mapOptions(question.options),
        }));

    const mapGroups = (groups?: ApiQuestionnaireGroup[]): QuestionnaireGroup[] =>
        (groups ?? []).map((group, index) => ({
            id: group.groupId != null ? String(group.groupId) : `group-${index}`,
            title: group.title ?? '',
            displayOrder: group.displayOrder ?? index,
            legend: (group.legend ?? []).map((option, legendIndex) => ({
                id: String(option.optionId ?? `${option.text ?? 'opzione'}-${legendIndex}`),
                text: option.text ?? '',
                displayOrder: option.displayOrder ?? 0,
            })),
            questions: mapQuestions(group.questions),
        }));

    const mapTemplate = (template: ApiQuestionnaireTemplate): Questionnaire => ({
        id: String(template.templateId),
        title: template.title,
        description: template.description ?? '',
        frequency: formatFrequency(template.frequency),
        isActive: template.status ?? false,
        groups: mapGroups(template.groups),
    });

    useEffect(() => {
        let cancelled = false;
        const loadTemplates = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${apiBaseUrl}/api/v1/questionnaires/templates`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                if (!response.ok) {
                    throw new Error('Impossibile caricare i questionari');
                }

                const data: ApiQuestionnaireTemplate[] = await response.json();
                if (!cancelled) {
                    setQuestionnaires(data.map(mapTemplate));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Errore durante il caricamento');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadTemplates();

        return () => {
            cancelled = true;
        };
    }, [apiBaseUrl]);

    // const handleEditFrequency = (id: string, currentFrequency: string) => {
    //     setEditingId(id);
    //     setFrequency(currentFrequency);
    // };

    // const handleSaveFrequency = () => {
    //     // In real app, save to backend
    //     alert(`Frequenza aggiornata a: ${frequency}`);
    //     setEditingId(null);
    // };

    return (
        <div>
            {!showAll && (
                <h2 className="text-2xl font-bold text-iov-dark-blue mb-6">Questionari</h2>
            )}

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-iov-gray-text">Caricamento questionari...</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {!isLoading && !error && questionnaires.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-iov-gray-text">Nessun questionario disponibile</p>
                </div>
            )}

            {!isLoading && !error && (
                <div className="space-y-4">
                    {questionnaires.map((questionnaire) => (
                        <div
                            key={questionnaire.id}
                            className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-iov-light-blue transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-6 h-6 text-iov-dark-blue" />
                                        <h3 className="text-lg font-bold text-iov-dark-blue">{questionnaire.title}</h3>
                                    </div>
                                    <p className="text-iov-gray-text mb-4">{questionnaire.description}</p>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-iov-gray-text" />
                                            <span className="text-iov-gray-text">Frequenza:</span>
                                            <span className="font-medium text-iov-dark-blue capitalize">{questionnaire.frequency}</span>
                                            {/* <button
                                                onClick={() => handleEditFrequency(questionnaire.id, questionnaire.frequency)}
                                                className="text-iov-dark-blue hover:text-iov-dark-blue-hover ml-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button> */}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-iov-gray-text">Stato:</span>
                                            <button className="flex items-center gap-1">
                                                {questionnaire.isActive ? (
                                                    <>
                                                        <ToggleRight className="w-6 h-6 text-green-600" />
                                                        <span className="text-green-600 font-medium">Attivo</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                                                        <span className="text-gray-500 font-medium">Disattivato</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="bg-iov-yellow text-iov-yellow-text px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                    onClick={() => {
                                        if (onViewAnswers) {
                                            onViewAnswers(questionnaire.id);
                                            return;
                                        }
                                        setTemplateModal({
                                            isOpen: true,
                                            questionnaire,
                                        });
                                    }}
                                >
                                    Visualizza
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load Template Modal */}
            {!onViewAnswers && (
                <LoadTemplate
                    isOpen={templateModal.isOpen}
                    onClose={() => setTemplateModal({ ...templateModal, isOpen: false })}
                    title={templateModal.questionnaire?.title}
                    groups={templateModal.questionnaire?.groups}
                    isActive={templateModal.questionnaire?.isActive}
                    readonly={true}
                />
            )}
        </div>
    );
}

export default QuestionnaireList;
