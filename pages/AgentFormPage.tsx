import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Agent, Tool, ToolType, MCPType } from '../types';
import { getAgent, createAgent, updateAgent, getAgents } from '../services/mockApi';
import { invokeAgent } from '../services/geminiService';
import { MODELS } from '../constants';

const initialAgentState: Omit<Agent, 'id' | 'created_date' | 'updated_date' | 'last_used_date' | 'invocations'> = {
    name: '',
    description: '',
    model: MODELS[0],
    system_prompt: '',
    tools: [],
};

// Component defined outside to prevent re-creation on re-renders
const ToolEditor: React.FC<{ tool: Tool, onUpdate: (tool: Tool) => void, onDelete: () => void, allAgents: Agent[] }> = ({ tool, onUpdate, onDelete, allAgents }) => {
    const handleFieldChange = (field: string, value: any) => {
        onUpdate({ ...tool, [field]: value });
    };

    const handleTypeChange = (newType: ToolType) => {
        const base = { id: tool.id, name: tool.name };
        let newTool: Tool;

        switch (newType) {
            case ToolType.API:
                newTool = { ...base, type: ToolType.API, url: '', authorization_header: '' };
                break;
            case ToolType.Agent:
                newTool = { ...base, type: ToolType.Agent, agent_id: '', agent_name: '' };
                break;
            case ToolType.MCP:
            default:
                newTool = { ...base, type: ToolType.MCP, mcp_type: MCPType.URL };
                break;
        }
        onUpdate(newTool);
    };

    return (
        <div className="bg-gray-700 p-4 rounded-md mb-4 border border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input 
                    type="text" 
                    placeholder="Tool Name" 
                    value={tool.name} 
                    onChange={e => handleFieldChange('name', e.target.value)} 
                    className="bg-gray-800 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none md:col-span-2"
                />
                <select 
                    value={tool.type} 
                    onChange={e => handleTypeChange(e.target.value as ToolType)} 
                    className="bg-gray-800 p-2 rounded border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    <option value={ToolType.MCP}>MCP</option>
                    <option value={ToolType.API}>API</option>
                    <option value={ToolType.Agent}>Agent</option>
                </select>
            </div>
            
            <div>
                {tool.type === ToolType.MCP && (
                    <>
                        <select value={(tool as any).mcp_type || MCPType.URL} onChange={e => handleFieldChange('mcp_type', e.target.value)} className="bg-gray-800 p-2 rounded w-full mb-2 border border-gray-600">
                            <option value={MCPType.URL}>HTTP Mode</option>
                            <option value={MCPType.Command}>CLI Mode</option>
                        </select>
                        {(tool as any).mcp_type === 'url' ? (
                            <>
                                <input type="text" placeholder="URL" value={(tool as any).url || ''} onChange={e => handleFieldChange('url', e.target.value)} className="bg-gray-800 p-2 rounded w-full mb-2 border border-gray-600" />
                                <input type="text" placeholder="Authorization Header" value={(tool as any).authorization_header || ''} onChange={e => handleFieldChange('authorization_header', e.target.value)} className="bg-gray-800 p-2 rounded w-full border border-gray-600" />
                            </>
                        ) : (
                            <>
                                <input type="text" placeholder="Command" value={(tool as any).command || ''} onChange={e => handleFieldChange('command', e.target.value)} className="bg-gray-800 p-2 rounded w-full mb-2 border border-gray-600" />
                                <input type="text" placeholder="Parameters" value={(tool as any).parameters || ''} onChange={e => handleFieldChange('parameters', e.target.value)} className="bg-gray-800 p-2 rounded w-full border border-gray-600" />
                            </>
                        )}
                    </>
                )}
                {tool.type === ToolType.API && (
                    <>
                        <input type="text" placeholder="URL" value={(tool as any).url || ''} onChange={e => handleFieldChange('url', e.target.value)} className="bg-gray-800 p-2 rounded w-full mb-2 border border-gray-600" />
                        <input type="text" placeholder="Authorization Header" value={(tool as any).authorization_header || ''} onChange={e => handleFieldChange('authorization_header', e.target.value)} className="bg-gray-800 p-2 rounded w-full border border-gray-600" />
                    </>
                )}
                {tool.type === ToolType.Agent && (
                    <select value={(tool as any).agent_id || ''} onChange={e => handleFieldChange('agent_id', e.target.value)} className="bg-gray-800 p-2 rounded w-full border border-gray-600">
                        <option value="">Select an Agent</option>
                        {allAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                )}
            </div>
            <div className="text-right mt-4">
                <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">Remove Tool</button>
            </div>
        </div>
    );
};

const ApiEndpointInfo: React.FC<{ agentId: string }> = ({ agentId }) => {
    const [copied, setCopied] = useState(false);
    const baseUrl = `${window.location.origin}/api/${agentId}`;
    const apiUrl = `${baseUrl}/<SESSION_ID>`;
    const curlCommand = `curl -X POST \\
  '${apiUrl}' \\
  -H 'Authorization: Bearer <YOUR_API_TOKEN>' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "UserQuery": "Your question here..."
  }'`;

    const handleCopy = () => {
        navigator.clipboard.writeText(curlCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">API Endpoint</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">
                    First, create a session by calling <code className="bg-gray-900 px-1 rounded text-indigo-300">{baseUrl}/create_session</code>. Then, use the returned <code className="bg-gray-900 px-1 rounded text-indigo-300">session_id</code> in the URL below to interact with the agent.
                </p>
                <div className="mt-4">
                    <label className="block text-gray-400 mb-1 text-sm">cURL Request</label>
                    <div className="relative">
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-md text-xs overflow-x-auto">
                            <code>{curlCommand}</code>
                        </pre>
                        <button 
                            onClick={handleCopy} 
                            className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold py-1 px-2 rounded"
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AgentFormPage: React.FC = () => {
    const { agentId } = useParams<{ agentId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(agentId);

    const [agent, setAgent] = useState<Omit<Agent, 'id' | 'created_date' | 'updated_date' | 'last_used_date' | 'invocations'>>(initialAgentState);
    const [allAgents, setAllAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Test panel state
    const [testQuery, setTestQuery] = useState('');
    const [testResponse, setTestResponse] = useState('');
    const [testLog, setTestLog] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const agentsList = await getAgents();
            setAllAgents(agentsList);

            if (isEditing && agentId) {
                const existingAgent = await getAgent(parseInt(agentId, 10));
                if (existingAgent) {
                    setAgent(existingAgent);
                } else {
                    navigate('/404');
                }
            } else {
                setAgent(initialAgentState);
            }
            setLoading(false);
        };
        loadData();
    }, [agentId, isEditing, navigate]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setAgent({ ...agent, [e.target.name]: e.target.value });
    };

    const handleToolChange = useCallback((index: number, updatedTool: Tool) => {
        const newTools = [...agent.tools];
        newTools[index] = updatedTool;
        setAgent(prev => ({ ...prev, tools: newTools }));
    }, [agent.tools]);

    const addTool = () => {
        const newTool: Tool = {
            id: `new_${Date.now()}`,
            name: '',
            type: ToolType.MCP,
            mcp_type: MCPType.URL,
        };
        setAgent(prev => ({ ...prev, tools: [...prev.tools, newTool] }));
    };

    const removeTool = useCallback((index: number) => {
        setAgent(prev => ({ ...prev, tools: prev.tools.filter((_, i) => i !== index) }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && agentId) {
            await updateAgent(parseInt(agentId, 10), agent);
        } else {
            await createAgent(agent);
        }
        navigate('/agents');
    };
    
    const handleTest = async () => {
        if (!testQuery) return;
        setIsTesting(true);
        setTestResponse('');
        setTestLog('');
        const result = await invokeAgent(agent.system_prompt, testQuery, agent.model);
        setTestResponse(result.response);
        setTestLog(result.log);
        setIsTesting(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Agent' : 'Create Agent'}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Name</label>
                        <input type="text" name="name" value={agent.name} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea name="description" value={agent.description} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Model</label>
                        <select name="model" value={agent.model} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">System Prompt</label>
                        <textarea name="system_prompt" value={agent.system_prompt} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600 h-40 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    {/* Tools Section */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Tools</h2>
                        <div className="space-y-2 mb-4">
                            {agent.tools.map((tool, index) => (
                                <ToolEditor key={tool.id} tool={tool} onUpdate={(updatedTool) => handleToolChange(index, updatedTool)} onDelete={() => removeTool(index)} allAgents={allAgents} />
                            ))}
                        </div>
                        <div className="flex space-x-2">
                           <button type="button" onClick={addTool} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors">Add Tool</button>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors duration-300">
                        {isEditing ? 'Update Agent' : 'Save Agent'}
                    </button>
                </form>

                {/* API Endpoint Info */}
                {isEditing && agentId && <ApiEndpointInfo agentId={agentId} />}
            </div>
            
            {/* Test Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Test Agent</h2>
                 <div className="mb-4">
                    <label className="block text-gray-400 mb-2">User Query</label>
                    <textarea value={testQuery} onChange={(e) => setTestQuery(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button onClick={handleTest} disabled={isTesting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors duration-300 disabled:bg-gray-500">
                    {isTesting ? 'Running...' : 'Send Query'}
                </button>
                 <div className="mt-6">
                    <label className="block text-gray-400 mb-2">Response</label>
                    <textarea readOnly value={testResponse} className="w-full p-2 bg-gray-900 rounded border border-gray-600 h-32" />
                </div>
                 <div className="mt-4">
                    <label className="block text-gray-400 mb-2">Log</label>
                    <pre className="w-full p-2 bg-gray-900 rounded border border-gray-600 h-48 overflow-auto text-xs text-gray-300">{testLog}</pre>
                </div>
            </div>
        </div>
    );
};

export default AgentFormPage;