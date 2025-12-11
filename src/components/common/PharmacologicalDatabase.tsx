import { Database, ExternalLink } from 'lucide-react';

function PharmacologicalDatabase() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Database Farmacologico</h1>
                <p className="text-iov-gray-text">Accesso alla banca dati Farmadati</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="bg-iov-light-blue w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Database className="w-12 h-12 text-iov-dark-blue-text" />
                </div>

                <h2 className="text-2xl font-bold text-iov-dark-blue mb-4">Collegamento a Farmadati</h2>

                <p className="text-iov-gray-text mb-8">
                    Il collegamento alla banca dati farmacologica Farmadati sarà disponibile a breve. Potrai consultare
                    informazioni dettagliate su principi attivi, farmaci, interazioni e posologie.
                </p>

                <button
                    disabled
                    className="bg-iov-yellow text-iov-yellow-text px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                    <ExternalLink className="w-6 h-6" />
                    Collegati a Farmadati
                </button>

                <p className="text-sm text-iov-gray-text mt-6 italic">Funzionalità in fase di sviluppo</p>
            </div>

            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Funzionalità Future</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ricerca farmaci per principio attivo</li>
                    <li>• Verifica interazioni farmacologiche</li>
                    <li>• Consultazione posologie raccomandate</li>
                    <li>• Informazioni su effetti collaterali</li>
                    <li>• Aggiornamenti in tempo reale</li>
                </ul>
            </div>
        </div>
    );
}

export default PharmacologicalDatabase;
