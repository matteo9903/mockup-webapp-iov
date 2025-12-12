import { useState } from 'react';
import { CheckCircle, Eye, Calendar } from 'lucide-react';
import { mockPendingApprovals } from '../../data/mockData.ts';
import { PendingApproval } from '../../types/index.ts';
import Modal from '../common/Modal.tsx';

function FarmacistaApprovals() {
    const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Approvazioni Farmacista</h1>
                <p className="text-iov-gray-text">Visualizza le richieste di onboarding pazienti</p>
            </div>

            {mockPendingApprovals.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-iov-dark-blue mb-2">Nessuna richiesta disponibile</h2>
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
                                        <span className="text-lg font-bold text-iov-dark-blue-text">
                                            {approval.patientName.charAt(0)}{approval.patientSurname.charAt(0)}
                                        </span>
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

                                <div className="flex items-center gap-2 text-sm text-iov-gray-text mb-4">
                                    <Calendar className="w-4 h-4" />
                                    <span>Inviata: {approval.submittedAt.toLocaleDateString('it-IT')}</span>
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
                                    Visualizza
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Approval Detail Modal */}
            <Modal
                isOpen={selectedApproval !== null}
                onClose={() => setSelectedApproval(null)}
                title="Dettaglio Richiesta"
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

                        {/* Close Button */}
                        <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-200">
                            <button
                                onClick={() => setSelectedApproval(null)}
                                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default FarmacistaApprovals;
