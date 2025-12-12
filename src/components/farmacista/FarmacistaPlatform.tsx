import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../common/Header.tsx';
import Navbar from '../common/Navbar.tsx';
import { Home, Users, UserPlus, FileText, Bell, Database, Activity } from 'lucide-react';
import FarmacistaHome from './FarmacistaHome.tsx';
import PatientOnboarding from './PatientOnboarding.tsx';
import PatientList from './PatientList.tsx';
import PatientDetail from './PatientDetail.tsx';
import FarmacistaApprovals from './FarmacistaApprovals.tsx';
import QuestionnaireList from '../common/QuestionnaireList.tsx';
import NotificationsList from '../common/NotificationsList.tsx';
import PharmacologicalDatabase from '../common/PharmacologicalDatabase.tsx';

function FarmacistaPlatform() {
    const navItems = [
        { to: '/farmacista/home', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/farmacista/patients', label: 'Pazienti', icon: <Users className="w-4 h-4" /> },
        { to: '/farmacista/onboarding', label: 'Nuovo Paziente', icon: <UserPlus className="w-4 h-4" /> },
        { to: '/farmacista/approvals', label: 'Approvazioni', icon: <Activity className="w-4 h-4" /> },
        { to: '/farmacista/questionnaires', label: 'Questionari', icon: <FileText className="w-4 h-4" /> },
        { to: '/farmacista/notifications', label: 'Notifiche', icon: <Bell className="w-4 h-4" /> },
        { to: '/farmacista/database', label: 'Database', icon: <Database className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-iov-gradient">
            <Header title="Piattaforma Farmacista" />
            <Navbar items={navItems} />

            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="home" element={<FarmacistaHome />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="patient/:id" element={<PatientDetail />} />
                    <Route path="onboarding" element={<PatientOnboarding />} />
                    <Route path="approvals" element={<FarmacistaApprovals />} />
                    <Route path="questionnaires" element={<QuestionnaireList showAll />} />
                    <Route path="notifications" element={<NotificationsList showAll />} />
                    <Route path="database" element={<PharmacologicalDatabase />} />
                    <Route path="*" element={<Navigate to="/farmacista/home" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default FarmacistaPlatform;
