import React, { useState } from 'react';
import { RotateCcw, Lock, Plus, Edit2, AlertCircle } from 'lucide-react';
import { mockAdminUsers } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

function UsersManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState(mockAdminUsers);
    const [disabledUsers, setDisabledUsers] = useState<string[]>([]);
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', name: '', surname: '', role: 'clinico' as 'clinico' | 'farmacista' });
    const [roleMenuOpen, setRoleMenuOpen] = useState<string | null>(null);

    // Mock count of pending registration requests
    const pendingRegistrations = 3;

    const handleResetPassword = (userId: string) => {
        alert(`Password resettata per utente ID: ${userId}`);
    };

    const handleToggleDisable = (userId: string) => {
        setDisabledUsers(
            disabledUsers.includes(userId)
                ? disabledUsers.filter((id) => id !== userId)
                : [...disabledUsers, userId]
        );
    };

    const handleChangeRole = (userId: string, newRole: 'clinico' | 'farmacista') => {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setRoleMenuOpen(null);
    };

    const handleChangeInfo = (userId: string) => {
        alert(`Modifica informazioni per utente ID: ${userId}`);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.username || !newUser.name || !newUser.surname) {
            alert('Compila tutti i campi');
            return;
        }
        const userToAdd = {
            id: `u${users.length + 1}`,
            username: newUser.username,
            name: newUser.name,
            surname: newUser.surname,
            role: newUser.role,
        };
        setUsers([...users, userToAdd]);
        setNewUser({ username: '', name: '', surname: '', role: 'clinico' });
        setShowNewUserForm(false);
        alert(`Utente ${newUser.username} creato con successo`);
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-iov-dark-blue mb-2">Area Gestione Utenze Clinico</h1>
                <p className="text-iov-gray-text">Crea, modifica o disabilita utenze dei clinici.</p>
            </div>

            {/* Urgent alert for pending registrations */}
            {pendingRegistrations > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-yellow-900 mb-1">
                                Attenzione: Richieste di Registrazione in Attesa
                            </h3>
                            <p className="text-yellow-800">
                                Ci sono <strong>{pendingRegistrations}</strong> richieste di registrazione in attesa. Rivedi e approva le
                                richieste per permettere l'accesso ai nuovi utenti.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/registrazioni')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors whitespace-nowrap"
                        >
                            Vai alle Richieste
                        </button>
                    </div>
                </div>
            )}

            {/* Create new user section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <button
                    onClick={() => setShowNewUserForm(!showNewUserForm)}
                    className="flex items-center gap-2 text-iov-dark-blue font-semibold hover:opacity-75 transition"
                >
                    <Plus className="w-5 h-5" />
                    Crea nuovo profilo
                </button>

                {showNewUserForm && (
                    <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-iov-gray-text mb-2">Username</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                    placeholder="es. drossi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-iov-gray-text mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                    placeholder="es. Davide"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-iov-gray-text mb-2">Cognome</label>
                                <input
                                    type="text"
                                    value={newUser.surname}
                                    onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                    placeholder="es. Rossi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-iov-gray-text mb-2">Ruolo</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'clinico' | 'farmacista' })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                                >
                                    <option value="clinico">Clinico</option>
                                    <option value="farmacista">Farmacista</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-iov-light-blue text-iov-dark-blue-text font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
                            >
                                Crea profilo
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowNewUserForm(false)}
                                className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
                            >
                                Annulla
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Users table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-iov-light-blue/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Username</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Nome</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Cognome</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Ruolo</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Stato</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className={disabledUsers.includes(user.id) ? 'bg-gray-50' : ''}>
                                    <td className="px-6 py-4 font-medium text-iov-dark-blue">{user.username}</td>
                                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-700">{user.surname}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-iov-light-blue/30 text-iov-dark-blue-text">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`text-xs font-medium ${
                                                disabledUsers.includes(user.id)
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                            }`}
                                        >
                                            {disabledUsers.includes(user.id) ? 'Disabilitato' : 'Attivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleResetPassword(user.id)}
                                                className="bg-iov-light-blue/20 text-iov-dark-blue-text hover:bg-iov-light-blue/40 transition px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium whitespace-nowrap"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Reset Password
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setRoleMenuOpen(roleMenuOpen === user.id ? null : user.id)}
                                                    className="bg-iov-pink/20 text-iov-pink-text hover:bg-iov-pink/40 transition px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium whitespace-nowrap"
                                                >
                                                    Cambia Ruolo
                                                </button>
                                                {roleMenuOpen === user.id && (
                                                    <div className="absolute top-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10">
                                                        <button
                                                            onClick={() => handleChangeRole(user.id, 'clinico')}
                                                            className="block w-full text-left px-4 py-2 text-sm text-iov-dark-blue hover:bg-iov-light-blue/20 font-medium"
                                                        >
                                                            Clinico
                                                        </button>
                                                        <button
                                                            onClick={() => handleChangeRole(user.id, 'farmacista')}
                                                            className="block w-full text-left px-4 py-2 text-sm text-iov-dark-blue hover:bg-iov-light-blue/20 font-medium border-t"
                                                        >
                                                            Farmacista
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleChangeInfo(user.id)}
                                                className="bg-iov-yellow/20 text-iov-yellow-text hover:bg-iov-yellow/40 transition px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium whitespace-nowrap"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Cambia Info
                                            </button>
                                            <button
                                                onClick={() => handleToggleDisable(user.id)}
                                                className={`px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition whitespace-nowrap ${
                                                    disabledUsers.includes(user.id)
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                <Lock className="w-4 h-4" />
                                                {disabledUsers.includes(user.id) ? 'Abilita' : 'Disabilita'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UsersManagement;
