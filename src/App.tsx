import { Routes, Route, Navigate } from 'react-router-dom';
import PlatformSelector from './components/PlatformSelector.tsx';
import Login from './components/auth/Login.tsx';
import Register from './components/auth/Register.tsx';
import FarmacistaPlatform from './components/farmacista/FarmacistaPlatform.tsx';
import ClinicoPlatform from './components/clinico/ClinicoPlatform.tsx';
import AdminPlatform from './components/admin/AdminPlatform.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlatformSelector />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/farmacista/*" element={<FarmacistaPlatform />} />
      <Route path="/clinico/*" element={<ClinicoPlatform />} />
      <Route path="/admin/*" element={<AdminPlatform />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

