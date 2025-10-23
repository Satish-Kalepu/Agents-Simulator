
export enum ToolType {
    MCP = 'MCP',
    API = 'API',
    Agent = 'Agent',
}

export enum MCPType {
    URL = 'url',
    Command = 'command',
}

export interface BaseTool {
    id: string;
    name: string;
    type: ToolType;
}

export interface MCPTool extends BaseTool {
    type: ToolType.MCP;
    mcp_type: MCPType;
    url?: string;
    authorization_header?: string;
    command?: string;
    parameters?: string;
}

export interface APITool extends BaseTool {
    type: ToolType.API;
    url: string;
    authorization_header: string;
}

export interface AgentTool extends BaseTool {
    type: ToolType.Agent;
    agent_id: string;
    agent_name: string;
}

export type Tool = MCPTool | APITool | AgentTool;

export interface Agent {
    id: number;
    name: string;
    description: string;
    model: string;
    system_prompt: string;
    tools: Tool[];
    created_date: string;
    updated_date: string;
    last_used_date: string | null;
    invocations: number;
}

export interface Session {
    id: number;
    agent_id: number;
    agent_name?: string; // For display purposes
    created_date: string;
    last_used_date: string | null;
    invocations: number;
}

export enum MessageRole {
    User = 'user',
    Assistant = 'assistant',
}

export interface Message {
    id: number;
    agent_id: number;
    session_id: number;
    datetime: string;
    role: MessageRole;
    message: string;
}

export interface AuthorizationToken {
    id: number;
    user_id: number;
    agent_id: number | null; // Can be null if it's a general token
    token: string;
    active: boolean;
    created_date: string;
    last_used_date: string | null;
    expire_date: string | null;
    invocations: number;
    max_invocations: number | null;
}

export interface User {
    id: number;
    name: string;
    username: string;
    password?: string; // Should not be sent from API, but needed for forms
    created_date: string;
    last_login_date: string | null;
    tokens?: AuthorizationToken[];
}

export interface ModelLog {
    id: number;
    datetime: string;
    model: string;
    agent_id: number;
    session_id: number;
    message_id: number;
    apiRequest: {
        url: string;
        method: string;
        headers: Record<string, any>;
        body: string; // Raw JSON string
    };
    apiResponse: {
        statusCode: number;
        headers: Record<string, any>;
        body: string; // Raw JSON string
    };
    user_query: string;
    agent_response: string;
    duration: number; // in ms
    tokens: number;
    input_tokens: number;
    output_tokens: number;
}

export interface AgentTestLog {
    id: number;
    agent_id: number;
    datetime: string;
    query: string;
    response: string;
}

export enum AgentChangeEvent {
    Create = 'create',
    Edit = 'edit',
    Delete = 'delete',
}

export interface AgentChangeLog {
    id: number;
    user_id: number;
    agent_id: number;
    datetime: string;
    event: AgentChangeEvent;
    description: string;
}