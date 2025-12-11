import { useState } from 'react';
import { FileText, Calendar, ToggleLeft, ToggleRight, Edit2 } from 'lucide-react';
import { mockQuestionnaires } from '../../data/mockData.ts';
import Modal from './Modal.tsx';

interface QuestionnaireListProps {
    patientId?: string;
    showAll?: boolean;
}

function QuestionnaireList({ patientId, showAll = false }: QuestionnaireListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [frequency, setFrequency] = useState('');

    const questionnaires = showAll
        ? mockQuestionnaires
        : mockQuestionnaires.filter((q) => q.patientId === patientId || !q.patientId);

    const handleEditFrequency = (id: string, currentFrequency: string) => {
        setEditingId(id);
        setFrequency(currentFrequency);
    };

    const handleSaveFrequency = () => {
        // In real app, save to backend
        alert(`Frequenza aggiornata a: ${frequency}`);
        setEditingId(null);
    };

    return (
        <div>
            {!showAll && (
                <h2 className="text-2xl font-bold text-iov-dark-blue mb-6">Questionari Paziente</h2>
            )}

            {questionnaires.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-iov-gray-text">Nessun questionario disponibile</p>
                </div>
            )}

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
                                        <button
                                            onClick={() => handleEditFrequency(questionnaire.id, questionnaire.frequency)}
                                            className="text-iov-dark-blue hover:text-iov-dark-blue-hover ml-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
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

                            <button className="bg-iov-yellow text-iov-yellow-text px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                                Visualizza Template
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Frequency Modal */}
            <Modal
                isOpen={editingId !== null}
                onClose={() => setEditingId(null)}
                title="Modifica Frequenza"
                size="sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">Frequenza</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                        >
                            <option value="giornaliero">Giornaliero</option>
                            <option value="settimanale">Settimanale</option>
                            <option value="mensile">Mensile</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSaveFrequency}
                        className="w-full bg-iov-dark-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-iov-dark-blue-hover transition-colors"
                    >
                        Salva
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default QuestionnaireList;
