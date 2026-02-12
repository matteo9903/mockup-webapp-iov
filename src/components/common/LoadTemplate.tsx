import React, { useState } from 'react';
import Modal from './Modal';
import { QuestionnaireGroup, QuestionnaireAnswerOption } from '../../types/index';
import { Edit2, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface LoadTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  groups?: QuestionnaireGroup[];
  isActive?: boolean;
  readonly?: boolean;
}

const LoadTemplate: React.FC<LoadTemplateProps> = ({ isOpen, onClose, title, groups = [], isActive: initialIsActive = true, readonly = true }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [questionGroups, setQuestionGroups] = useState<QuestionnaireGroup[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize groups when modal opens or questionnaire changes
  React.useEffect(() => {
    if (isOpen) {
      setQuestionGroups(groups);
      setIsActive(initialIsActive);
    }
  }, [isOpen, groups, initialIsActive]);

  const hasQuestions = questionGroups.some((group) => group.questions.length > 0);

  const resolveLegend = (group: QuestionnaireGroup): QuestionnaireAnswerOption[] => {
    if (group.legend && group.legend.length > 0) {
      return group.legend;
    }

    const legendMap = new Map<string, QuestionnaireAnswerOption>();
    group.questions.forEach((question) => {
      question.options.forEach((option) => {
        const key = `${option.displayOrder ?? -1}|${option.text ?? ''}`;
        if (!legendMap.has(key)) {
          legendMap.set(key, option);
        }
      });
    });

    return Array.from(legendMap.values());
  };

  const handleEditQuestion = (id: string, text: string) => {
    setEditingQuestionId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id: string) => {
    setQuestionGroups((prev) =>
      prev.map((group) => ({
        ...group,
        questions: group.questions.map((q) => (q.id === id ? { ...q, text: editingText } : q)),
      })),
    );
    setEditingQuestionId(null);
    setEditingText('');
    setHasChanges(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestionGroups((prev) =>
      prev.map((group) => ({
        ...group,
        questions: group.questions.filter((q) => q.id !== id),
      })),
    );
    setShowDeleteConfirm(null);
    setHasChanges(true);
  };

  const handleAddQuestion = () => {
    const newId = `q_new_${Date.now()}`;
    setQuestionGroups((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: `group_${Date.now()}`,
            title: '',
            displayOrder: 0,
            questions: [
              {
                id: newId,
                text: '',
                type: 'text',
                required: false,
                displayOrder: 0,
                options: [],
              },
            ],
          },
        ];
      }

      return prev.map((group, index) =>
        index === 0
          ? {
              ...group,
              questions: [
                ...group.questions,
                {
                  id: newId,
                  text: '',
                  type: 'text',
                  required: false,
                  displayOrder: group.questions.length + 1,
                  options: [],
                },
              ],
            }
          : group,
      );
    });
    setHasChanges(true);
  };

  const handleToggleState = () => {
    setIsActive(!isActive);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to backend
    alert('Modifiche salvate con successo!');
    setIsEditMode(false);
    setHasChanges(false);
  };

  const currentGroups = questionGroups.length > 0 ? questionGroups : groups;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Visualizza Risposte'} size="lg">
      <div className="w-full max-h-[70vh] overflow-y-auto">
        {hasQuestions ? (
          <>
            {/* Modifica Button and State Toggle */}
            <div className="mb-6 flex justify-between items-center">
              {isEditMode && (
                <button
                  onClick={handleToggleState}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border-2 border-iov-dark-blue"
                >
                  {isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-green-600" />
                      <span className="text-iov-dark-blue font-medium">Attivo</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 font-medium">Disattivato</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => {
                  if (isEditMode) {
                    if (!hasChanges) {
                      // nothing changed: exit edit mode without saving
                      setIsEditMode(false);
                      return;
                    }
                    handleSaveChanges();
                  } else {
                    setIsEditMode(true);
                  }
                }}
                disabled={readonly || (isEditMode && !hasChanges)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  readonly
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : isEditMode
                    ? `text-white ${hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`
                    : 'bg-iov-dark-blue text-white hover:bg-iov-dark-blue-hover'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                {isEditMode ? 'Salva Modifiche' : 'Modifica'}
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {currentGroups.map((group, groupIndex) => {
                const legend = resolveLegend(group);
                return (
                  <div key={group.id ?? `group-${groupIndex}`} className="space-y-4">
                    {group.title?.trim() && (
                      <h4 className="text-base font-semibold text-iov-dark-blue">{group.title}</h4>
                    )}

                    {legend.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs text-iov-gray-text">
                        {legend.map((option) => (
                          <span
                            key={option.id}
                            className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-full"
                          >
                            {option.text}
                          </span>
                        ))}
                      </div>
                    )}

                    {group.questions.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-iov-dark-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            {isEditMode && editingQuestionId === question.id ? (
                              <div className="flex gap-2">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="flex-1 px-3 py-2 border-2 border-iov-dark-blue rounded-lg focus:outline-none resize-none"
                                  rows={3}
                                />
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleSaveEdit(question.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setEditingQuestionId(null)}
                                    className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-500"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <p className="text-iov-gray-text pt-0.5">{question.text}</p>
                                {isEditMode && (
                                  <div className="flex gap-2 ml-2 flex-shrink-0">
                                    <button
                                      onClick={() => handleEditQuestion(question.id, question.text)}
                                      className="text-iov-dark-blue hover:text-iov-dark-blue-hover"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirm(question.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete Confirmation */}
                        {showDeleteConfirm === question.id && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 mb-2">Sei sicuro di voler eliminare questa domanda?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700"
                              >
                                Elimina
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm font-medium hover:bg-gray-400"
                              >
                                Annulla
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Add Question Button */}
            {isEditMode && (
              <div className="mt-6">
                <button
                  onClick={handleAddQuestion}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-iov-dark-blue text-iov-dark-blue rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi Domanda
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-iov-gray-text">
            Nessuna domanda disponibile per questo questionario.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoadTemplate;
