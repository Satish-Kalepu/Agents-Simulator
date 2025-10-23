
import { Agent, Session, Message, User, AuthorizationToken, Tool, MessageRole, ModelLog, AgentTestLog, AgentChangeLog, AgentChangeEvent } from '../types';

// --- MOCK DATABASE ---
let agents: Agent[] = [
    { id: 1, name: 'Customer Service Bot', description: 'Handles customer queries about orders.', model: 'gemini-2.5-flash', system_prompt: 'You are a helpful customer service assistant.', tools: [], created_date: new Date().toISOString(), updated_date: new Date().toISOString(), last_used_date: null, invocations: 15 },
    { id: 2, name: 'Code Generator', description: 'Generates code snippets in various languages.', model: 'gemini-2.5-pro', system_prompt: 'You are an expert programmer. Generate clean, efficient code.', tools: [], created_date: new Date().toISOString(), updated_date: new Date().toISOString(), last_used_date: new Date().toISOString(), invocations: 42 },
];

let users: User[] = [
    { id: 1, name: 'Satish Kalepu', username: 'satish', password: 'satish', created_date: '2025-10-22T10:10:10Z', last_login_date: null, tokens: [
        { id: 1, user_id: 1, agent_id: null, token: 'abc-123-def-456-ghi-789-jkl-012', active: true, created_date: new Date().toISOString(), last_used_date: null, expire_date: null, invocations: 0, max_invocations: null },
    ]},
    { id: 2, name: 'Jane Doe', username: 'jane', password: 'jane', created_date: new Date().toISOString(), last_login_date: new Date().toISOString(), tokens: []},
];

let sessions: Session[] = [
    { id: 101, agent_id: 1, created_date: new Date().toISOString(), last_used_date: new Date().toISOString(), invocations: 5 },
    { id: 102, agent_id: 2, created_date: new Date().toISOString(), last_used_date: new Date().toISOString(), invocations: 10 },
];

let messages: Message[] = [
    { id: 1, agent_id: 1, session_id: 101, datetime: new Date().toISOString(), role: MessageRole.User, message: 'Hello, where is my order?' },
    { id: 2, agent_id: 1, session_id: 101, datetime: new Date().toISOString(), role: MessageRole.Assistant, message: 'I can help with that. What is your order number?' },
    { id: 3, agent_id: 2, session_id: 102, datetime: new Date().toISOString(), role: MessageRole.User, message: 'Write a python function for fibonacci' },
    { id: 4, agent_id: 2, session_id: 102, datetime: new Date().toISOString(), role: MessageRole.Assistant, message: 'def fib(n): ...' },
];

let tokens: AuthorizationToken[] = [
    { id: 1, user_id: 1, agent_id: null, token: 'abc-123-def-456-ghi-789-jkl-012', active: true, created_date: new Date().toISOString(), last_used_date: null, expire_date: null, invocations: 0, max_invocations: null },
];

let modelLogs: ModelLog[] = [
    { 
        id: 1, 
        datetime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), 
        model: 'gemini-2.5-pro', 
        agent_id: 2, 
        session_id: 102, 
        message_id: 3, 
        apiRequest: {
            url: "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent",
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: 'Write a python function for fibonacci',
                config: { systemInstruction: 'You are an expert programmer. Generate clean, efficient code.' }
            })
        },
        apiResponse: {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'def fib(n): ...' })
        },
        user_query: 'Write a python function for fibonacci', 
        agent_response: 'def fib(n): ...', 
        duration: 1234, 
        tokens: 150, 
        input_tokens: 50, 
        output_tokens: 100 
    },
    { 
        id: 2, 
        datetime: new Date(Date.now() - 1000 * 60 * 10).toISOString(), 
        model: 'gemini-2.5-flash', 
        agent_id: 1, 
        session_id: 101, 
        message_id: 1, 
        apiRequest: {
            url: "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: 'Hello, where is my order?',
                config: { systemInstruction: 'You are a helpful customer service assistant.' }
            })
        },
        apiResponse: {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'I can help with that. What is your order number?' })
        },
        user_query: 'Hello, where is my order?', 
        agent_response: 'I can help with that. What is your order number?', 
        duration: 876, 
        tokens: 80, 
        input_tokens: 20, 
        output_tokens: 60 
    },
];

let agentTestLogs: AgentTestLog[] = [
    { id: 1, agent_id: 1, datetime: new Date(Date.now() - 1000 * 60 * 2).toISOString(), query: 'Test query for order status', response: 'The order #123 has been shipped.' },
    { id: 2, agent_id: 2, datetime: new Date(Date.now() - 1000 * 60 * 8).toISOString(), query: 'Generate a hello world in Rust', response: 'fn main() { println!("Hello, world!"); }' },
];

let agentChangeLogs: AgentChangeLog[] = [
    { id: 1, user_id: 1, agent_id: 1, datetime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), event: AgentChangeEvent.Edit, description: 'Updated system prompt for Customer Service Bot to be more friendly.' },
    { id: 2, user_id: 2, agent_id: 2, datetime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), event: AgentChangeEvent.Create, description: 'Created new agent: Code Generator.' },
];


let nextAgentId = 3;
let nextUserId = 3;
let nextTokenId = 2;

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 300));

// --- AGENT API ---
export const getAgents = () => simulateDelay([...agents]);
export const getAgent = (id: number) => simulateDelay(agents.find(a => a.id === id));
export const createAgent = (data: Omit<Agent, 'id' | 'created_date' | 'updated_date' | 'last_used_date' | 'invocations'>) => {
    const newAgent: Agent = {
        ...data,
        id: nextAgentId++,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        last_used_date: null,
        invocations: 0,
    };
    agents.push(newAgent);
    return simulateDelay(newAgent);
};
export const updateAgent = (id: number, data: Partial<Agent>) => {
    agents = agents.map(a => a.id === id ? { ...a, ...data, updated_date: new Date().toISOString() } : a);
    return simulateDelay(agents.find(a => a.id === id));
};
export const deleteAgent = (id: number) => {
    agents = agents.filter(a => a.id !== id);
    return simulateDelay(true);
};

// --- SESSION & MESSAGE API ---
export const getSessions = () => {
    const sessionsWithAgentNames = sessions.map(s => ({
        ...s,
        agent_name: agents.find(a => a.id === s.agent_id)?.name || 'Unknown Agent'
    }));
    return simulateDelay(sessionsWithAgentNames.sort((a,b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()));
}
export const getMessages = () => simulateDelay([...messages].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()));
export const getMessagesForSession = (sessionId: number) => {
    const sessionMessages = messages.filter(m => m.session_id === sessionId);
    return simulateDelay(sessionMessages.sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()));
}

// --- USER API ---
export const getUsers = () => simulateDelay([...users]);
export const getUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
        return simulateDelay({ ...user, tokens: tokens.filter(t => t.user_id === id) });
    }
    return simulateDelay(undefined);
};
export const createUser = (data: Partial<User>) => {
    const newUser: User = {
        id: nextUserId++,
        name: data.name!,
        username: data.username!,
        password: data.password!,
        created_date: new Date().toISOString(),
        last_login_date: null,
    };
    users.push(newUser);
    return simulateDelay(newUser);
};
export const updateUser = (id: number, data: Partial<User>) => {
    users = users.map(u => {
        if (u.id === id) {
            const updatedUser = { ...u, name: data.name!, username: data.username! };
            if (data.password) {
                updatedUser.password = data.password;
            }
            return updatedUser;
        }
        return u;
    });
    return simulateDelay(users.find(u => u.id === id));
};
export const deleteUser = (id: number) => {
    users = users.filter(u => u.id !== id);
    return simulateDelay(true);
};

// --- TOKEN API ---
export const addToken = (userId: number) => {
    const randomToken = Array.from({ length: 128 }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
    const newToken: AuthorizationToken = {
        id: nextTokenId++,
        user_id: userId,
        agent_id: null,
        token: randomToken,
        active: true,
        created_date: new Date().toISOString(),
        last_used_date: null,
        expire_date: null,
        invocations: 0,
        max_invocations: null,
    };
    tokens.push(newToken);
    return simulateDelay(newToken);
}
export const deleteToken = (tokenId: number) => {
    tokens = tokens.filter(t => t.id !== tokenId);
    return simulateDelay(true);
}

// --- LOGS API ---
export const getModelLogs = () => {
    return simulateDelay([...modelLogs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()));
}
export const getAgentTestLogs = () => {
    return simulateDelay([...agentTestLogs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()));
}
export const getAgentChangeLogs = () => {
    return simulateDelay([...agentChangeLogs].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()));
}