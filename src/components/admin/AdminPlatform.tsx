import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../common/Header.tsx';
import Navbar from '../common/Navbar.tsx';
import { Home, Users, Link, Download, UserPlus } from 'lucide-react';
import AdminHome from './AdminHome.tsx';
import Associations from './Associations.tsx';
import UsersManagement from './UsersManagement.tsx';
import ExportData from './ExportData.tsx';
import AdminRegistrazioni from './AdminRegistrazioni.tsx';

function AdminPlatform() {
    const navItems = [
        { to: '/admin/home', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { to: '/admin/associations', label: "Associazioni", icon: <Link className="w-4 h-4" /> },
        { to: '/admin/users', label: 'Utenze', icon: <Users className="w-4 h-4" /> },
        { to: '/admin/registrazioni', label: 'Registrazioni', icon: <UserPlus className="w-4 h-4" /> },
        { to: '/admin/export', label: 'Export', icon: <Download className="w-4 h-4" /> },
    ];

    // Subpages implemented in separate files

    return (
        <div className="min-h-screen bg-iov-gradient">
            <Header title="Piattaforma Admin" />
            <Navbar items={navItems} />

            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="home" element={<AdminHome />} />
                    <Route path="associations" element={<Associations />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="registrazioni" element={<AdminRegistrazioni />} />
                    <Route path="export" element={<ExportData />} />
                    <Route path="*" element={<Navigate to="/admin/home" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default AdminPlatform;
