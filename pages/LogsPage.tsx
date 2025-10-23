
import React, { useState, useEffect } from 'react';
import { Agent, User, ModelLog, AgentTestLog, AgentChangeLog } from '../types';
import { getAgents, getUsers, getModelLogs, getAgentTestLogs, getAgentChangeLogs } from '../services/mockApi';

type LogTab = 'model' | 'test' | 'change';

const LogDetailModal: React.FC<{ log: ModelLog | null, onClose: () => void }> = ({ log, onClose }) => {
    if (!log) return null;

    const prettyPrintJson = (jsonString: string) => {
        try {
            return JSON.stringify(JSON.parse(jsonString), null, 2);
        } catch (e) {
            return jsonString; // Return as is if not valid JSON
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-700">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-200">Model Log Details (ID: {log.id})</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {/* Request Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-indigo-400">API Request</h3>
                            <div className="font-mono">
                                <span className="font-bold text-green-400">{log.apiRequest.method}</span>
                                <span className="text-gray-400 ml-2">{log.apiRequest.url}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-400 mb-1">Headers</h4>
                                <pre className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs overflow-x-auto">{JSON.stringify(log.apiRequest.headers, null, 2)}</pre>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-400 mb-1">Body</h4>
                                <pre className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs overflow-x-auto">{prettyPrintJson(log.apiRequest.body)}</pre>
                            </div>
                        </div>
                        {/* Response Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-green-400">API Response</h3>
                            <div>
                               <span className="font-bold text-gray-400">Status: </span>
                               <span className="font-mono text-green-400">{log.apiResponse.statusCode}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-400 mb-1">Headers</h4>
                                <pre className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs overflow-x-auto">{JSON.stringify(log.apiResponse.headers, null, 2)}</pre>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-400 mb-1">Body</h4>
                                <pre className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs overflow-x-auto">{prettyPrintJson(log.apiResponse.body)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModelLogsTable: React.FC<{ logs: ModelLog[], agents: Agent[] }> = ({ logs, agents }) => {
    const [selectedLog, setSelectedLog] = useState<ModelLog | null>(null);
    const getAgentName = (agentId: number) => agents.find(a => a.id === agentId)?.name || `ID: ${agentId}`;
    
    return (
        <>
            <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
            <table className="min-w-full">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Agent/Session</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tokens (In/Out)</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {logs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(log.datetime).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <div>{getAgentName(log.agent_id)}</div>
                                <div className="text-xs text-gray-500">Session #{log.session_id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.model}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.duration}ms</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.input_tokens}/{log.output_tokens}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => setSelectedLog(log)} className="text-indigo-400 hover:text-indigo-300">View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

const TestLogsTable: React.FC<{ logs: AgentTestLog[], agents: Agent[] }> = ({ logs, agents }) => {
    const getAgentName = (agentId: number) => agents.find(a => a.id === agentId)?.name || `ID: ${agentId}`;
    return (
        <table className="min-w-full">
            <thead className="bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Query</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Response</th>
                </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
                {logs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(log.datetime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getAgentName(log.agent_id)}</td>
                        <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-sm">{log.query}</td>
                        <td className="px-6 py-4 text-sm text-gray-300 truncate max-w-sm">{log.response}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const ChangeLogsTable: React.FC<{ logs: AgentChangeLog[], agents: Agent[], users: User[] }> = ({ logs, agents, users }) => {
    const getAgentName = (agentId: number) => agents.find(a => a.id === agentId)?.name || `ID: ${agentId}`;
    const getUserName = (userId: number) => users.find(u => u.id === userId)?.name || `ID: ${userId}`;
    const eventColors: { [key: string]: string } = {
        'create': 'bg-green-900 text-green-300',
        'edit': 'bg-yellow-900 text-yellow-300',
        'delete': 'bg-red-900 text-red-300',
    };
    
    return (
        <table className="min-w-full">
            <thead className="bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
                {logs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(log.datetime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getUserName(log.user_id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getAgentName(log.agent_id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${eventColors[log.event]}`}>
                                {log.event}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{log.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


const LogsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LogTab>('model');
    const [loading, setLoading] = useState(true);

    const [agents, setAgents] = useState<Agent[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    const [modelLogs, setModelLogs] = useState<ModelLog[]>([]);
    const [testLogs, setTestLogs] = useState<AgentTestLog[]>([]);
    const [changeLogs, setChangeLogs] = useState<AgentChangeLog[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [
                agentData, userData, modelLogData, testLogData, changeLogData
            ] = await Promise.all([
                getAgents(), getUsers(), getModelLogs(), getAgentTestLogs(), getAgentChangeLogs()
            ]);
            setAgents(agentData);
            setUsers(userData);
            setModelLogs(modelLogData);
            setTestLogs(testLogData);
            setChangeLogs(changeLogData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) return <div className="text-center p-4">Loading logs...</div>;

        switch (activeTab) {
            case 'model':
                return <ModelLogsTable logs={modelLogs} agents={agents} />;
            case 'test':
                return <TestLogsTable logs={testLogs} agents={agents} />;
            case 'change':
                return <ChangeLogsTable logs={changeLogs} agents={agents} users={users} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tabId: LogTab, label: string }> = ({ tabId, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tabId
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">System Logs</h1>

            <div className="flex space-x-2 mb-6 border-b border-gray-700 pb-3">
                <TabButton tabId="model" label="Model Logs" />
                <TabButton tabId="test" label="Test Logs" />
                <TabButton tabId="change" label="Change Logs" />
            </div>

            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default LogsPage;