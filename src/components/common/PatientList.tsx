import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, User } from 'lucide-react';
import { mockPatients } from '../../data/mockData.ts';
import StatusBadge from './StatusBadge.tsx';

function PatientList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUnitaOperativa, setSelectedUnitaOperativa] = useState<string | 'all'>('all');

    const filteredPatients = mockPatients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.surname.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUnitaOperativa = selectedUnitaOperativa === 'all' || patient.unitaOperativa === selectedUnitaOperativa;
        return matchesSearch && matchesUnitaOperativa;
    });

    // Get unique unità operative for dropdown
    const unitaOperativeList = Array.from(new Set(mockPatients.map(p => p.unitaOperativa))).sort();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Lista Pazienti</h1>
                <p className="text-iov-gray-text">Gestisci e visualizza tutti i pazienti</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-iov-dark-blue" />
                    <h2 className="text-lg font-semibold text-iov-dark-blue">Filtri</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">
                            Cerca paziente
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nome o cognome..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Unità Operativa Filter */}
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">
                            Unità Operativa
                        </label>
                        <select
                            value={selectedUnitaOperativa}
                            onChange={(e) => setSelectedUnitaOperativa(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                        >
                            <option value="all">Tutte</option>
                            {unitaOperativeList.map((unitaOperativa) => (
                                <option key={unitaOperativa} value={unitaOperativa}>
                                    {unitaOperativa}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-iov-gray-text">
                {filteredPatients.length} pazient{filteredPatients.length === 1 ? 'e' : 'i'} trovat{filteredPatients.length === 1 ? 'o' : 'i'}
            </div>

            {/* Patient list as table */}
            {filteredPatients.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl shadow-md">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-iov-dark-blue">Nome</th>
                                <th className="px-4 py-2 text-left text-iov-dark-blue">Cognome</th>
                                <th className="px-4 py-2 text-left text-iov-dark-blue">Unità Operativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="hover:bg-iov-light-blue/20 cursor-pointer transition"
                                    onClick={() => navigate(`/farmacista/patient/${patient.id}`)}
                                >
                                    <td className="px-4 py-2 font-medium flex items-center gap-2">
                                        <User className="w-5 h-5 text-iov-dark-blue-text" />
                                        {patient.name}
                                    </td>
                                    <td className="px-4 py-2">{patient.surname}</td>
                                    <td className="px-4 py-2">{patient.unitaOperativa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-iov-gray-text text-lg">Nessun paziente trovato</p>
                </div>
            )}
        </div>
    );
}

export default PatientList;
