import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../common/Header.tsx';
import Navbar from '../common/Navbar.tsx';
import { Home, Users, CheckSquare, FileText, Bell, Database } from 'lucide-react';
import ClinicoHome from './ClinicoHome.tsx';
import ApprovalsQueue from './ApprovalsQueue.tsx';
import PatientList from '../farmacista/PatientList.tsx'; // Reuse same component
import PatientDetail from '../farmacista/PatientDetail.tsx'; // Reuse same component
import QuestionnaireList from '../common/QuestionnaireList.tsx';
import NotificationsList from '../common/NotificationsList.tsx';
import PharmacologicalDatabase from '../common/PharmacologicalDatabase.tsx';

function ClinicoPlatform() {
    const navItems = [
        { to: '/clinico/home', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/clinico/approvals', label: 'Approvazioni', icon: <CheckSquare className="w-4 h-4" /> },
        { to: '/clinico/patients', label: 'Pazienti', icon: <Users className="w-4 h-4" /> },
        { to: '/clinico/questionnaires', label: 'Questionari', icon: <FileText className="w-4 h-4" /> },
        { to: '/clinico/notifications', label: 'Notifiche', icon: <Bell className="w-4 h-4" /> },
        { to: '/clinico/database', label: 'Database', icon: <Database className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-iov-gradient">
            <Header title="Piattaforma Clinico" />
            <Navbar items={navItems} />

            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="home" element={<ClinicoHome />} />
                    <Route path="approvals" element={<ApprovalsQueue />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="patient/:id" element={<PatientDetail />} />
                    <Route path="questionnaires" element={<QuestionnaireList showAll />} />
                    <Route path="notifications" element={<NotificationsList showAll />} />
                    <Route path="database" element={<PharmacologicalDatabase />} />
                    <Route path="*" element={<Navigate to="/clinico/home" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default ClinicoPlatform;
