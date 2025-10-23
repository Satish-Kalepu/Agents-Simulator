
import React, { useState, useEffect, useMemo } from 'react';
import { Message, Agent, Session } from '../types';
import { getMessages, getAgents, getSessions } from '../services/mockApi';

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    const [agentFilter, setAgentFilter] = useState<string>('all');
    const [sessionFilter, setSessionFilter] = useState<string>('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [msgData, agentData, sessionData] = await Promise.all([
                getMessages(),
                getAgents(),
                getSessions(),
            ]);
            setMessages(msgData);
            setAgents(agentData);
            setSessions(sessionData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredMessages = useMemo(() => {
        return messages
            .filter(m => agentFilter === 'all' || m.agent_id === parseInt(agentFilter, 10))
            .filter(m => sessionFilter === 'all' || m.session_id === parseInt(sessionFilter, 10));
    }, [messages, agentFilter, sessionFilter]);
    
    const getAgentName = (agentId: number) => agents.find(a => a.id === agentId)?.name || 'Unknown Agent';

    if (loading) return <div className="text-center p-4">Loading messages...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">All Messages</h1>

            {/* Filters */}
            <div className="flex space-x-4 mb-6 p-4 bg-gray-800 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Agent</label>
                    <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} className="bg-gray-700 p-2 rounded border border-gray-600">
                        <option value="all">All Agents</option>
                        {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Session</label>
                     <select value={sessionFilter} onChange={e => setSessionFilter(e.target.value)} className="bg-gray-700 p-2 rounded border border-gray-600">
                        <option value="all">All Sessions</option>
                        {sessions.map(session => <option key={session.id} value={session.id}>Session #{session.id}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Agent/Session</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {filteredMessages.map(message => (
                            <tr key={message.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 text-sm text-gray-300">{message.message.substring(0, 100)}{message.message.length > 100 ? '...' : ''}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${message.role === 'user' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                                        {message.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <div>{getAgentName(message.agent_id)}</div>
                                    <div className="text-xs text-gray-500">Session #{message.session_id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(message.datetime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MessagesPage;
