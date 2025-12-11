import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, User } from 'lucide-react';
import { mockPatients } from '../../data/mockData.ts';
import { PDTA, SedeIOV } from '../../types/index.ts';
import StatusBadge from '../common/StatusBadge.tsx';

function PatientList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPDTA, setSelectedPDTA] = useState<PDTA | 'all'>('all');
    const [selectedSede, setSelectedSede] = useState<SedeIOV | 'all'>('all');

    const filteredPatients = mockPatients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.surname.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPDTA = selectedPDTA === 'all' || patient.pdta === selectedPDTA;
        const matchesSede = selectedSede === 'all' || patient.sedeIOV === selectedSede;
        return matchesSearch && matchesPDTA && matchesSede;
    });

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* PDTA Filter */}
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">
                            PDTA
                        </label>
                        <select
                            value={selectedPDTA}
                            onChange={(e) => setSelectedPDTA(e.target.value as PDTA | 'all')}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                        >
                            <option value="all">Tutti</option>
                            <option value="mammella">Mammella</option>
                            <option value="urologico">Urologico</option>
                            <option value="gastroenterico">Gastroenterico</option>
                        </select>
                    </div>

                    {/* Sede Filter */}
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">
                            Sede IOV
                        </label>
                        <select
                            value={selectedSede}
                            onChange={(e) => setSelectedSede(e.target.value as SedeIOV | 'all')}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                        >
                            <option value="all">Tutte</option>
                            <option value="Padova">Padova</option>
                            <option value="Castelfranco Veneto">Castelfranco Veneto</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-iov-gray-text">
                {filteredPatients.length} pazient{filteredPatients.length === 1 ? 'e' : 'i'} trovat{filteredPatients.length === 1 ? 'o' : 'i'}
            </div>

            {/* Patient cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <button
                        key={patient.id}
                        onClick={() => navigate(`/farmacista/patient/${patient.id}`)}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left group hover:-translate-y-1 border-2 border-transparent hover:border-iov-light-blue"
                    >
                        {/* Patient icon */}
                        <div className="bg-iov-light-blue w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <User className="w-8 h-8 text-iov-dark-blue-text" />
                        </div>

                        {/* Patient info */}
                        <h3 className="text-xl font-bold text-iov-dark-blue mb-2">
                            {patient.name} {patient.surname}
                        </h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-iov-gray-text">PDTA:</span>
                                <span className="text-sm bg-iov-pink px-3 py-1 rounded-full text-iov-pink-text font-medium capitalize">
                                    {patient.pdta}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-iov-gray-text">Sede:</span>
                                <span className="text-sm bg-iov-yellow px-3 py-1 rounded-full text-iov-yellow-text font-medium">
                                    {patient.sedeIOV}
                                </span>
                            </div>
                        </div>

                        {/* Status */}
                        {patient.idCard && patient.therapyPlan && (
                            <StatusBadge status={patient.idCard.approvalStatus} size="sm" />
                        )}
                        {!patient.idCard && (
                            <span className="text-sm text-gray-500 italic">Onboarding non completato</span>
                        )}
                    </button>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-iov-gray-text text-lg">Nessun paziente trovato</p>
                </div>
            )}
        </div>
    );
}

export default PatientList;
