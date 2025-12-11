import { Routes, Route, Navigate } from 'react-router-dom';
import CliniciIOVSelector from './CliniciIOVSelector';
import OncologoRadioterapista from './medici/OncologoRadioterapista';
import CaseManagerSoniaSabrina from './case-manager-sonia-sabrina/CaseManagerSoniaSabrina';
import CaseManagerVirginiaEvelina from './case-manager/CaseManagerVirginiaEvelina';
import AmbulatorioCureSimultanee from './ambulatori/AmbulatorioCureSimultanee';
import AmbulatorioOncogeriatria from './ambulatori/AmbulatorioOncogeriatria';
import AmbulatorioOsteoncologia from './ambulatori/AmbulatorioOsteoncologia';

function CliniciIOV() {
  return (
    <Routes>
      <Route index element={<CliniciIOVSelector />} />
      <Route path="oncologo-radioterapista" element={<OncologoRadioterapista />} />
      <Route path="case-manager-sonia-sabrina" element={<CaseManagerSoniaSabrina />} />
      <Route path="case-manager-virginia-evelina" element={<CaseManagerVirginiaEvelina />} />
      <Route path="ambulatorio-cure-simultanee" element={<AmbulatorioCureSimultanee />} />
      <Route path="ambulatorio-oncogeriatria" element={<AmbulatorioOncogeriatria />} />
      <Route path="ambulatorio-osteoncologia" element={<AmbulatorioOsteoncologia />} />
      <Route path="*" element={<Navigate to="/clinici-iov" replace />} />
    </Routes>
  );
}

export default CliniciIOV;

