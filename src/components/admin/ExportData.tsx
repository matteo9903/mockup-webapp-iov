import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { mockExportJobs } from '../../data/mockData';

function ExportData() {
    const [exportJobs, setExportJobs] = useState(mockExportJobs);
    const [format, setFormat] = useState<'CSV' | 'JSON' | 'PDF'>('CSV');
    const [dataType, setDataType] = useState('patients');

    const handleNewExport = () => {
        const newJob = {
            id: `e${exportJobs.length + 1}`,
            name: `Export ${dataType} - ${new Date().toLocaleDateString()}`,
            createdAt: new Date(),
            format: format,
            status: 'processing' as const,
            requestedBy: 'Amministratore',
        };
        setExportJobs([newJob, ...exportJobs]);
        setTimeout(() => {
            setExportJobs((prev) =>
                prev.map((job) =>
                    job.id === newJob.id ? { ...job, status: 'ready' as const } : job
                )
            );
        }, 2000);
    };

    const handleDownload = (jobId: string) => {
        const job = exportJobs.find((j) => j.id === jobId);
        alert(`Download avviato: ${job?.name}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready':
                return 'text-green-600';
            case 'processing':
                return 'text-blue-600';
            case 'failed':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ready':
                return <CheckCircle className="w-5 h-5" />;
            case 'processing':
                return <RefreshCw className="w-5 h-5 animate-spin" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-iov-dark-blue mb-2">Area Export Dati</h1>
                <p className="text-iov-gray-text">Esporta dati del sistema e report in CSV/JSON/PDF.</p>
            </div>

            {/* Export creation panel */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-bold text-iov-dark-blue mb-4">Crea nuovo export</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">Tipo di dati</label>
                        <select
                            value={dataType}
                            onChange={(e) => setDataType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                        >
                            <option value="patients">Pazienti</option>
                            <option value="therapies">Terapie</option>
                            <option value="questionnaires">Questionari</option>
                            <option value="notifications">Notifiche</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-iov-gray-text mb-2">Formato</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value as 'CSV' | 'JSON' | 'PDF')}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none"
                        >
                            <option value="CSV">CSV</option>
                            <option value="JSON">JSON</option>
                            <option value="PDF">PDF</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleNewExport}
                            className="w-full bg-iov-light-blue text-iov-dark-blue-text font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
                        >
                            <Download className="w-4 h-4 inline mr-2" />
                            Crea export
                        </button>
                    </div>
                </div>
            </div>

            {/* Export jobs history */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-iov-light-blue/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Nome export</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Formato</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Stato</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Richiesto da</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Data</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-iov-dark-blue">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {exportJobs.map((job) => (
                                <tr key={job.id}>
                                    <td className="px-6 py-4 font-medium text-iov-dark-blue">{job.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-iov-pink/20 text-iov-pink-text">
                                            {job.format}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 ${getStatusColor(job.status)}`}>
                                            {getStatusIcon(job.status)}
                                            <span className="capitalize">{job.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{job.requestedBy}</td>
                                    <td className="px-6 py-4 text-sm text-iov-gray-text">
                                        {job.createdAt instanceof Date
                                            ? job.createdAt.toLocaleDateString('it-IT')
                                            : new Date(job.createdAt).toLocaleDateString('it-IT')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDownload(job.id)}
                                            disabled={job.status !== 'ready'}
                                            className={`px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition ${
                                                job.status === 'ready'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
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

export default ExportData;
