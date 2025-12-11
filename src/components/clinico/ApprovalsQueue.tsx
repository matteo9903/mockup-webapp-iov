import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';
import { mockPendingApprovals } from '../../data/mockData.ts';
import { PendingApproval } from '../../types/index.ts';
import Modal from '../common/Modal.tsx';

function ApprovalsQueue() {
    const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
    const [notes, setNotes] = useState('');

    const handleApprove = () => {
        if (selectedApproval) {
            alert(`Richiesta approvata per ${selectedApproval.patientName} ${selectedApproval.patientSurname}`);
            setSelectedApproval(null);
            setNotes('');
        }
    };

    const handleReject = () => {
        if (selectedApproval && notes.trim()) {
            alert(`Richiesta rifiutata per ${selectedApproval.patientName} ${selectedApproval.patientSurname}\nMotivo: ${notes}`);
            setSelectedApproval(null);
            setNotes('');
        } else {
            alert('Inserisci una motivazione per il rifiuto');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Coda Approvazioni</h1>
                <p className="text-iov-gray-text">Rivedi e approva le richieste di onboarding pazienti</p>
            </div>

            {mockPendingApprovals.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-iov-dark-blue mb-2">Nessuna richiesta in attesa</h2>
                    <p className="text-iov-gray-text">Tutte le richieste sono state processate</p>
                </div>
            )}

            <div className="space-y-4">
                {mockPendingApprovals.map((approval) => (
                    <div
                        key={approval.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-iov-light-blue"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-iov-light-blue w-12 h-12 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-iov-dark-blue-text" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-iov-dark-blue">
                                            {approval.patientName} {approval.patientSurname}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="bg-iov-pink px-3 py-1 rounded-full text-iov-pink-text font-medium text-sm capitalize">
                                                {approval.pdta}
                                            </span>
                                            <span className="bg-iov-yellow px-3 py-1 rounded-full text-iov-yellow-text font-medium text-sm">
                                                {approval.sedeIOV}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-iov-gray-text mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Inviata: {approval.submittedAt.toLocaleDateString('it-IT')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Da: {approval.submittedBy}</span>
                                    </div>
                                </div>

                                <div className="bg-iov-light-blue p-4 rounded-lg mb-4">
                                    <h4 className="font-semibold text-iov-dark-blue-text mb-2">Riepilogo Terapia</h4>
                                    <p className="text-sm text-iov-dark-blue-text">
                                        <strong>{approval.therapyPlan.drugs.length}</strong> farmac{approval.therapyPlan.drugs.length === 1 ? 'o' : 'i'} prescritti
                                    </p>
                                    <p className="text-sm text-iov-dark-blue-text">
                                        Periodo: {new Date(approval.therapyPlan.startDate).toLocaleDateString('it-IT')} -{' '}
                                        {new Date(approval.therapyPlan.endDate).toLocaleDateString('it-IT')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => setSelectedApproval(approval)}
                                    className="bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-iov-dark-blue-hover transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Eye className="w-4 h-4" />
                                    Rivedi
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Approval Detail Modal */}
            <Modal
                isOpen={selectedApproval !== null}
                onClose={() => {
                    setSelectedApproval(null);
                    setNotes('');
                }}
                title="Dettaglio Richiesta Approvazione"
                size="lg"
            >
                {selectedApproval && (
                    <div className="space-y-6">
                        {/* Patient Info */}
                        <div>
                            <h3 className="text-lg font-bold text-iov-dark-blue mb-3">
                                Paziente: {selectedApproval.patientName} {selectedApproval.patientSurname}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="bg-iov-pink px-3 py-1 rounded-full text-iov-pink-text font-medium text-sm capitalize">
                                    {selectedApproval.pdta}
                                </span>
                                <span className="bg-iov-yellow px-3 py-1 rounded-full text-iov-yellow-text font-medium text-sm">
                                    {selectedApproval.sedeIOV}
                                </span>
                            </div>
                        </div>

                        {/* ID Card */}
                        <div className="bg-iov-light-blue p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-iov-dark-blue-text mb-4">Carta d'Identità Farmacologica</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <strong>Nome:</strong> {selectedApproval.idCard.patient.name}
                                </div>
                                <div>
                                    <strong>Cognome:</strong> {selectedApproval.idCard.patient.surname}
                                </div>
                                <div className="col-span-2">
                                    <strong>Indirizzo:</strong> {selectedApproval.idCard.patient.address}
                                </div>
                                <div>
                                    <strong>Telefono:</strong> {selectedApproval.idCard.patient.telephone}
                                </div>
                                <div>
                                    <strong>Codice Fiscale:</strong> {selectedApproval.idCard.patient.fiscalCode}
                                </div>
                                <div className="col-span-2 border-t-2 border-white pt-3 mt-2">
                                    <strong>Caregiver:</strong> {selectedApproval.idCard.caregiver.name} {selectedApproval.idCard.caregiver.surname} -{' '}
                                    {selectedApproval.idCard.caregiver.telephone}
                                </div>
                            </div>
                        </div>

                        {/* Therapy Plan */}
                        <div className="bg-iov-pink p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-iov-pink-text mb-4">Piano Terapeutico</h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <strong>Data Inizio:</strong> {new Date(selectedApproval.therapyPlan.startDate).toLocaleDateString('it-IT')}
                                    </div>
                                    <div>
                                        <strong>Data Fine:</strong> {new Date(selectedApproval.therapyPlan.endDate).toLocaleDateString('it-IT')}
                                    </div>
                                </div>
                                <div>
                                    <strong className="block mb-2">Farmaci Prescritti:</strong>
                                    <div className="space-y-2">
                                        {selectedApproval.therapyPlan.drugs.map((drug, index) => (
                                            <div key={drug.id} className="bg-white p-3 rounded-lg text-sm">
                                                <strong>Farmaco {index + 1}:</strong> {drug.activePrinciple} - {drug.dosage} alle ore{' '}
                                                {drug.hourOfAssumption}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">
                                Note (obbligatorie per rifiuto)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                rows={4}
                                placeholder="Inserisci eventuali note o motivazioni..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-200">
                            <button
                                onClick={handleApprove}
                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Approva
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Rifiuta
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ApprovalsQueue;
