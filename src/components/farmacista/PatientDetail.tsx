import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, Bell } from 'lucide-react';
import { mockPatients } from '../../data/mockData.ts';
import { Drug } from '../../types/index';
import StatusBadge from '../common/StatusBadge.tsx';
import QuestionnaireList from '../common/QuestionnaireList.tsx';
import NotificationsList from '../common/NotificationsList.tsx';

type Tab = 'info' | 'questionnaires' | 'notifications';

function PatientDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('info');

    const patient = mockPatients.find((p) => p.id === id);

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
                                <span className="bg-iov-pink px-3 py-1 rounded-full text-iov-pink-text font-medium text-sm capitalize">
                                    {patient.pdta}
                                </span>
                                <span className="bg-iov-yellow px-3 py-1 rounded-full text-iov-yellow-text font-medium text-sm">
                                    {patient.sedeIOV}
                                </span>
                                {patient.idCard && <StatusBadge status={patient.idCard.approvalStatus} />}
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
                        {patient.idCard ? (
                            <>
                                {/* Pharmacological ID Card */}
                                <div className="bg-iov-light-blue p-6 rounded-lg">
                                    <h2 className="text-xl font-bold text-iov-dark-blue-text mb-4">Carta d'Identità Farmacologica</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong>Sede IOV:</strong> {patient.idCard.sedeIOV}
                                        </div>
                                        <div>
                                            <strong>Stato:</strong> <StatusBadge status={patient.idCard.approvalStatus} size="sm" />
                                        </div>
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
                                {patient.therapyPlan && (
                                    <div className="bg-iov-pink p-6 rounded-lg">
                                        <h2 className="text-xl font-bold text-iov-pink-text mb-4">Piano Terapeutico</h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <strong>Data Inizio:</strong> {new Date(patient.therapyPlan.startDate).toLocaleDateString('it-IT')}
                                                </div>
                                                <div>
                                                    <strong>Data Fine:</strong> {new Date(patient.therapyPlan.endDate).toLocaleDateString('it-IT')}
                                                </div>
                                                <div>
                                                    <strong>Stato:</strong> <StatusBadge status={patient.therapyPlan.approvalStatus} size="sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <strong className="block mb-2">Farmaci:</strong>
                                                <div className="space-y-2">
                                                    {patient.therapyPlan.drugs.map((drug: Drug) => (
                                                        <div key={drug.id} className="bg-white p-3 rounded-lg text-sm">
                                                            <strong>{drug.activePrinciple}</strong> - {drug.dosage} alle ore {drug.hourOfAssumption}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-iov-gray-text text-lg mb-4">Onboarding non completato per questo paziente</p>
                                <button
                                    onClick={() => navigate('/farmacista/onboarding')}
                                    className="bg-iov-yellow text-iov-yellow-text px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    Completa Onboarding
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'questionnaires' && <QuestionnaireList patientId={patient.id} />}

                {activeTab === 'notifications' && <NotificationsList patientId={patient.id} />}
            </div>
        </div>
    );
}

export default PatientDetail;
