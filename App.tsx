
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AgentsPage from './pages/AgentsPage';
import AgentFormPage from './pages/AgentFormPage';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import MessagesPage from './pages/MessagesPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import InformationPage from './pages/InformationPage';
import LogsPage from './pages/LogsPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // In a real app, this would be a proper context or state management solution
    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route 
                    path="/*" 
                    element={
                        isAuthenticated ? (
                            <Layout onLogout={handleLogout}>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/agents" replace />} />
                                    <Route path="/agents" element={<AgentsPage />} />
                                    <Route path="/agent/create" element={<AgentFormPage />} />
                                    <Route path="/agent/:agentId" element={<AgentFormPage />} />
                                    <Route path="/sessions" element={<SessionsPage />} />
                                    <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
                                    <Route path="/messages" element={<MessagesPage />} />
                                    <Route path="/users" element={<UsersPage />} />
                                    <Route path="/users/create" element={<UserFormPage />} />
                                    <Route path="/users/:userId" element={<UserFormPage />} />
                                    <Route path="/logs" element={<LogsPage />} />
                                    <Route path="/information" element={<InformationPage />} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </Layout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
            </Routes>
        </HashRouter>
    );
};

export default App;
