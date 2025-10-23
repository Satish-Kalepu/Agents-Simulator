
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Agent } from '../types';
import { getAgents, deleteAgent } from '../services/mockApi';

const AgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            const data = await getAgents();
            setAgents(data);
            setLoading(false);
        };
        fetchAgents();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this agent?')) {
            await deleteAgent(id);
            setAgents(agents.filter(agent => agent.id !== id));
        }
    };

    if (loading) return <div className="text-center p-4">Loading agents...</div>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Agents</h1>
                <Link to="/agent/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                    Create Agent
                </Link>
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Model</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invocations</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Used</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {agents.map(agent => (
                            <tr key={agent.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{agent.name}</div>
                                    <div className="text-sm text-gray-400">{agent.description.substring(0, 50)}...</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{agent.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{agent.invocations}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{agent.last_used_date ? new Date(agent.last_used_date).toLocaleString() : 'Never'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/agent/${agent.id}`} className="text-indigo-400 hover:text-indigo-300 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(agent.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentsPage;
