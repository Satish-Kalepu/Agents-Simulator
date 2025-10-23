
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Session } from '../types';
import { getSessions } from '../services/mockApi';

const SessionsPage: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            const data = await getSessions();
            setSessions(data);
            setLoading(false);
        };
        fetchSessions();
    }, []);

    if (loading) return <div className="text-center p-4">Loading sessions...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Sessions</h1>

            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Session ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Agent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invocations</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {sessions.map(session => (
                            <tr key={session.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{session.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{session.agent_name || `Agent #${session.agent_id}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(session.created_date).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{session.invocations}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/sessions/${session.id}`} className="text-indigo-400 hover:text-indigo-300">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SessionsPage;
