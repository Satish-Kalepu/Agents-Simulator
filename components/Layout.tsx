
import React, { Fragment, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

interface LayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

const SidebarIcon: React.FC<{ path: string }> = ({ path }) => {
    // FIX: Changed JSX.Element to React.ReactElement to fix "Cannot find namespace 'JSX'" error.
    const icons: { [key: string]: React.ReactElement } = {
        '/agents': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.247-8.995l10.494 0M12 21.747a9.747 9.747 0 110-19.494 9.747 9.747 0 010 19.494z" /></svg>,
        '/sessions': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
        '/messages': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        '/users': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 12a4 4 0 110-5.292" /></svg>,
        '/logs': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        '/information': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    };
    return icons[path] || <div className="h-6 w-6"></div>;
};

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };
    
    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-gray-800 p-4">
                <div className="text-2xl font-bold text-indigo-400 mb-8">Agents Sim</div>
                <nav>
                    <ul>
                        {NAV_LINKS.map(link => (
                            <li key={link.name} className="mb-2">
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                            isActive
                                                ? 'bg-indigo-500 text-white'
                                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                        }`
                                    }
                                >
                                    <SidebarIcon path={link.path} />
                                    <span className="ml-4">{link.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <button onClick={handleLogoutClick} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                        Logout
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
