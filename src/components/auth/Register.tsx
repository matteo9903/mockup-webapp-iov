import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ruolo: 'clinico',
        nome: '',
        cognome: '',
        email: '',
        codiceFiscale: '',
        password: '',
        ripeti_password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.nome.trim()) {
            setError('Nome è obbligatorio');
            return;
        }
        if (!formData.cognome.trim()) {
            setError('Cognome è obbligatorio');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email è obbligatoria');
            return;
        }
        if (!formData.email.includes('@')) {
            setError('Email non valida');
            return;
        }
        if (!formData.codiceFiscale.trim()) {
            setError('Codice Fiscale è obbligatorio');
            return;
        }
        if (formData.codiceFiscale.length !== 16) {
            setError('Codice Fiscale deve essere di 16 caratteri');
            return;
        }
        if (!formData.password) {
            setError('Password è obbligatoria');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password deve essere almeno 6 caratteri');
            return;
        }
        if (formData.password !== formData.ripeti_password) {
            setError('Le password non coincidono');
            return;
        }

        // Registration successful
        setSuccess(true);
        alert(
            `Registrazione completata!\n\nRuolo: ${formData.ruolo}\nNome: ${formData.nome} ${formData.cognome}\nEmail: ${formData.email}`
        );

        // Redirect to login after a short delay
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-iov-gradient flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-iov-dark-blue hover:opacity-75 transition mb-8 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Torna alla home
                </button>

                {/* Registration Card */}
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-iov-dark-blue mb-2">Registrazione</h1>
                    <p className="text-iov-gray-text mb-8">Crea un nuovo account</p>

                    {error && (
                        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6">
                            Registrazione completata! Reindirizzamento in corso...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Ruolo */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Ruolo *</label>
                            <select
                                name="ruolo"
                                value={formData.ruolo}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition"
                            >
                                <option value="clinico">Clinico</option>
                                <option value="farmacista">Farmacista</option>
                            </select>
                        </div>

                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Nome *</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Es. Giovanni"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition"
                            />
                        </div>

                        {/* Cognome */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Cognome *</label>
                            <input
                                type="text"
                                name="cognome"
                                value={formData.cognome}
                                onChange={handleChange}
                                placeholder="Es. Rossi"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Es. giovanni.rossi@example.com"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition"
                            />
                        </div>

                        {/* Codice Fiscale */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Codice Fiscale *</label>
                            <input
                                type="text"
                                name="codiceFiscale"
                                value={formData.codiceFiscale}
                                onChange={handleChange}
                                placeholder="Es. RSSGNN80A01H501Z"
                                maxLength={16}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition uppercase"
                            />
                            <p className="text-xs text-iov-gray-text mt-1">16 caratteri</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimo 6 caratteri"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-iov-gray-text hover:text-iov-dark-blue transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Ripeti Password */}
                        <div>
                            <label className="block text-sm font-medium text-iov-gray-text mb-2">Ripeti Password *</label>
                            <div className="relative">
                                <input
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    name="ripeti_password"
                                    value={formData.ripeti_password}
                                    onChange={handleChange}
                                    placeholder="Ripeti la password"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-iov-dark-blue focus:outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    className="absolute right-3 top-3 text-iov-gray-text hover:text-iov-dark-blue transition"
                                >
                                    {showRepeatPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={success}
                            className="w-full bg-iov-dark-blue text-white py-3 rounded-lg font-semibold hover:bg-iov-dark-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            Registrati
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-iov-gray-text mt-4">
                            Hai già un account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-iov-dark-blue font-medium hover:underline"
                            >
                                Accedi qui
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
