import { Routes, Route, Navigate } from 'react-router-dom';
import PlatformSelector from './components/PlatformSelector';
import MMGPlatform from './components/mmg/MMGPlatform';
import CliniciIOV from './components/clinici-iov/CliniciIOV';
import Paziente from './components/paziente/Paziente';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PlatformSelector />} />
      <Route path="/MMG" element={<MMGPlatform />} />
      <Route path="/clinici-iov/*" element={<CliniciIOV />} />
      <Route path="/paziente" element={<Paziente />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
