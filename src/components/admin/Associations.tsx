import React, { useState } from 'react';
import { Trash2, Move } from 'lucide-react';
import { mockClinicians, mockAssociations, mockPatients } from '../../data/mockData';

function Associations() {
    const [associations, setAssociations] = useState(mockAssociations);
    const [moveMenuOpen, setMoveMenuOpen] = useState<{ patientId: string; fromClinicianId: string } | null>(null);

    const handleRemoveAssociation = (clinicianId: string, patientId: string) => {
        setAssociations(
            associations.map((assoc) =>
                assoc.clinicianId === clinicianId
                    ? { ...assoc, patientIds: assoc.patientIds.filter((pid) => pid !== patientId) }
                    : assoc
            )
        );
    };

    const handleMovePatient = (patientId: string, fromClinicianId: string, toClinicianId: string) => {
        setAssociations(
            associations.map((assoc) => {
                if (assoc.clinicianId === fromClinicianId) {
                    return {
                        ...assoc,
                        patientIds: assoc.patientIds.filter((pid) => pid !== patientId),
                    };
                }
                if (assoc.clinicianId === toClinicianId) {
                    return {
                        ...assoc,
                        patientIds: assoc.patientIds.includes(patientId)
                            ? assoc.patientIds
                            : [...assoc.patientIds, patientId],
                    };
                }
                return assoc;
            })
        );
        setMoveMenuOpen(null);
    };

    const getClinician = (id: string) => mockClinicians.find((c) => c.id === id);
    const getPatient = (id: string) => mockPatients.find((p) => p.id === id);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-iov-dark-blue mb-2">Area Gestione Associazioni Clinico-Paziente</h1>
                <p className="text-iov-gray-text">Elenca e modifica le associazioni tra clinici e i loro pazienti.</p>
            </div>

            <div className="space-y-6">
                {associations.map((assoc) => {
                    const clinician = getClinician(assoc.clinicianId);
                    return (
                        <div key={assoc.clinicianId} className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-iov-dark-blue mb-4">
                                {clinician?.name} {clinician?.surname} ({clinician?.username})
                            </h3>
                            {assoc.patientIds.length === 0 ? (
                                <p className="text-iov-gray-text text-sm">Nessun paziente associato</p>
                            ) : (
                                <div className="space-y-2">
                                    {assoc.patientIds.map((patientId) => {
                                        const patient = getPatient(patientId);
                                        return (
                                            <div key={patientId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-iov-dark-blue">
                                                        {patient?.name} {patient?.surname}
                                                    </p>
                                                    <p className="text-xs text-iov-gray-text">PDTA: {patient?.pdta} | Sede: {patient?.sedeIOV}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                setMoveMenuOpen(
                                                                    moveMenuOpen?.patientId === patientId
                                                                        ? null
                                                                        : { patientId, fromClinicianId: assoc.clinicianId }
                                                                )
                                                            }
                                                            className="text-iov-dark-blue hover:text-iov-dark-blue/70 transition p-1"
                                                        >
                                                            <Move className="w-5 h-5" />
                                                        </button>
                                                        {moveMenuOpen?.patientId === patientId && (
                                                            <div className="absolute top-full right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 w-48">
                                                                <div className="text-xs font-semibold text-iov-gray-text px-4 py-2 border-b">Sposta verso:</div>
                                                                {associations
                                                                    .filter((a) => a.clinicianId !== assoc.clinicianId)
                                                                    .map((targetAssoc) => {
                                                                        const targetClinician = getClinician(targetAssoc.clinicianId);
                                                                        return (
                                                                            <button
                                                                                key={targetAssoc.clinicianId}
                                                                                onClick={() =>
                                                                                    handleMovePatient(patientId, assoc.clinicianId, targetAssoc.clinicianId)
                                                                                }
                                                                                className="block w-full text-left px-4 py-2 text-sm text-iov-dark-blue hover:bg-iov-light-blue/20 font-medium border-t"
                                                                            >
                                                                                {targetClinician?.name} {targetClinician?.surname}
                                                                            </button>
                                                                        );
                                                                    })}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveAssociation(assoc.clinicianId, patientId)}
                                                        className="text-red-500 hover:text-red-700 transition p-1"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Associations;
