import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User, Edit2 } from 'lucide-react';
import Modal from '../common/Modal.tsx';

interface RegistrationRequest {
    id: string;
    ruolo: 'clinico' | 'farmacista';
    nome: string;
    cognome: string;
    email: string;
    codiceFiscale: string;
    submittedAt: Date;
}

// Mock registration requests
const mockRegistrationRequests: RegistrationRequest[] = [
    {
        id: 'r1',
        ruolo: 'clinico',
        nome: 'Paolo',
        cognome: 'Bianchi',
        email: 'paolo.bianchi@example.com',
        codiceFiscale: 'BNCPLA85M15H501X',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'r2',
        ruolo: 'farmacista',
        nome: 'Elena',
        cognome: 'Martini',
        email: 'elena.martini@example.com',
        codiceFiscale: 'MRTLNE90F50H501Y',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'r3',
        ruolo: 'clinico',
        nome: 'Marco',
        cognome: 'Gentile',
        email: 'marco.gentile@example.com',
        codiceFiscale: 'GNTMRC88H20H501Z',
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
];

function AdminRegistrazioni() {
    const [requests, setRequests] = useState(mockRegistrationRequests);
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState<RegistrationRequest | null>(null);
    const [notes, setNotes] = useState('');

    const handleView = (request: RegistrationRequest) => {
        setSelectedRequest(request);
        setEditedData(request);
        setEditMode(false);
        setNotes('');
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        if (editedData) {
            setRequests(requests.map(r => r.id === editedData.id ? editedData : r));
            setSelectedRequest(editedData);
            setEditMode(false);
            alert('Modifiche salvate con successo');
        }
    };

    const handleApprove = () => {
        if (selectedRequest) {
            setRequests(requests.filter(r => r.id !== selectedRequest.id));
            alert(`Richiesta approvata per ${selectedRequest.nome} ${selectedRequest.cognome}`);
            setSelectedRequest(null);
            setNotes('');
        }
    };

    const handleReject = () => {
        if (selectedRequest && notes.trim()) {
            setRequests(requests.filter(r => r.id !== selectedRequest.id));
            alert(`Richiesta rifiutata per ${selectedRequest.nome} ${selectedRequest.cognome}\nMotivo: ${notes}`);
            setSelectedRequest(null);
            setNotes('');
        } else {
            alert('Inserisci una motivazione per il rifiuto');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Richieste di Registrazione</h1>
                <p className="text-iov-gray-text">Approva, modifica o rifiuta le richieste di registrazione degli utenti</p>
            </div>

            {requests.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-iov-dark-blue mb-2">Nessuna richiesta in attesa</h2>
                    <p className="text-iov-gray-text">Tutte le richieste sono state processate</p>
                </div>
            )}

            <div className="space-y-4">
                {requests.map((request) => (
                    <div
                        key={request.id}
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
                                            {request.nome} {request.cognome}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="bg-iov-pink px-3 py-1 rounded-full text-iov-pink-text font-medium text-sm capitalize">
                                                {request.ruolo}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-iov-gray-text mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Inviata: {request.submittedAt.toLocaleDateString('it-IT')}</span>
                                    </div>
                                    <div>
                                        <span>Email: {request.email}</span>
                                    </div>
                                </div>

                                <div className="bg-iov-light-blue p-4 rounded-lg">
                                    <p className="text-sm text-iov-dark-blue-text">
                                        <strong>Codice Fiscale:</strong> {request.codiceFiscale}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                                <button
                                    onClick={() => handleView(request)}
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

            {/* Registration Detail Modal */}
            <Modal
                isOpen={selectedRequest !== null}
                onClose={() => {
                    setSelectedRequest(null);
                    setEditMode(false);
                    setNotes('');
                }}
                title="Dettaglio Richiesta Registrazione"
                size="lg"
            >
                {selectedRequest && editedData && (
                    <div className="space-y-6">
                        {/* User Info */}
                        <div className="bg-iov-light-blue p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-iov-dark-blue-text">Informazioni Utente</h4>
                                {!editMode && (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-iov-yellow/30 text-iov-yellow-text px-3 py-1 rounded-lg text-sm font-medium hover:bg-iov-yellow/50 transition flex items-center gap-1"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Modifica
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Nome:</strong>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editedData.nome}
                                            onChange={(e) => setEditedData({ ...editedData, nome: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        />
                                    ) : (
                                        <span className="block mt-1">{editedData.nome}</span>
                                    )}
                                </div>
                                <div>
                                    <strong>Cognome:</strong>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editedData.cognome}
                                            onChange={(e) => setEditedData({ ...editedData, cognome: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        />
                                    ) : (
                                        <span className="block mt-1">{editedData.cognome}</span>
                                    )}
                                </div>
                                <div>
                                    <strong>Email:</strong>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            value={editedData.email}
                                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        />
                                    ) : (
                                        <span className="block mt-1">{editedData.email}</span>
                                    )}
                                </div>
                                <div>
                                    <strong>Codice Fiscale:</strong>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editedData.codiceFiscale}
                                            onChange={(e) => setEditedData({ ...editedData, codiceFiscale: e.target.value.toUpperCase() })}
                                            maxLength={16}
                                            className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none uppercase"
                                        />
                                    ) : (
                                        <span className="block mt-1">{editedData.codiceFiscale}</span>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <strong>Ruolo:</strong>
                                    {editMode ? (
                                        <select
                                            value={editedData.ruolo}
                                            onChange={(e) => setEditedData({ ...editedData, ruolo: e.target.value as 'clinico' | 'farmacista' })}
                                            className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                        >
                                            <option value="clinico">Clinico</option>
                                            <option value="farmacista">Farmacista</option>
                                        </select>
                                    ) : (
                                        <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-iov-pink/30 text-iov-pink-text capitalize">
                                            {editedData.ruolo}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {editMode && (
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="bg-iov-dark-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-iov-dark-blue-hover transition"
                                    >
                                        Salva Modifiche
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditedData(selectedRequest);
                                        }}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
                                    >
                                        Annulla
                                    </button>
                                </div>
                            )}
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

export default AdminRegistrazioni;
