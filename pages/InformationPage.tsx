
import React from 'react';

const postmanCollection = {
  "info": {
    "_postman_id": "a8c1b2d3-e4f5-a6b7-c8d9-e0f1a2b3c4d5",
    "name": "Agents Simulator API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Session",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{api_token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/{{agent_id}}/create_session",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "{{agent_id}}",
            "create_session"
          ]
        },
        "description": "Creates a new session for a given agent and returns a `session_id`."
      },
      "response": []
    },
    {
      "name": "Invoke Agent",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{api_token}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"UserQuery\": \"Your question here...\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/{{agent_id}}/{{session_id}}",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "{{agent_id}}",
            "{{session_id}}"
          ]
        },
        "description": "Sends a user query to a specific agent within a session and gets a response."
      },
      "response": []
    },
    {
      "name": "Get Messages",
      "request": {
        "method": "GET",
        "header": [
            {
                "key": "Authorization",
                "value": "Bearer {{api_token}}",
                "type": "text"
            }
        ],
        "url": {
          "raw": "{{base_url}}/api/{{agent_id}}/messages?session_id={{session_id}}",
          "host": [
            "{{base_url}}"
          ],
          "path": [
            "api",
            "{{agent_id}}",
            "messages"
          ],
          "query": [
              {
                  "key": "session_id",
                  "value": "{{session_id}}"
              }
          ]
        },
        "description": "Retrieves the message history for a given agent and session."
      },
      "response": []
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": window.location.origin,
      "type": "string"
    },
    {
      "key": "agent_id",
      "value": "1",
      "type": "string"
    },
    {
      "key": "session_id",
      "value": "",
      "type": "string"
    },
    {
      "key": "api_token",
      "value": "YOUR_API_TOKEN_HERE",
      "type": "string"
    }
  ]
};

const ApiCard: React.FC<{ method: string, path: string, description: string, children?: React.ReactNode }> = ({ method, path, description, children }) => {
    const methodColor = {
        'GET': 'bg-sky-600 text-sky-100',
        'POST': 'bg-emerald-600 text-emerald-100',
    }[method] || 'bg-gray-600';

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-4 mb-2">
                <span className={`px-3 py-1 rounded-md text-sm font-bold ${methodColor}`}>{method}</span>
                <code className="text-md text-indigo-300">{path}</code>
            </div>
            <p className="text-gray-400 text-sm ml-1">{description}</p>
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
};

const InformationPage: React.FC = () => {

    const handleDownload = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(postmanCollection, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'AgentsSimulator.postman_collection.json';
        link.click();
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">API Information</h1>
                <button 
                    onClick={handleDownload}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Postman Collection
                </button>
            </div>
            <p className="text-gray-400 mb-8">
                Use the following API endpoints to interact with your agents programmatically. All API requests require an `Authorization` header with a bearer token. You can generate tokens in the user edit page.
            </p>

            <div className="space-y-6">
                <ApiCard
                    method="POST"
                    path="/api/{agent_id}/create_session"
                    description="Creates a new session for an agent. The returned session_id should be used in subsequent calls to invoke the agent."
                />

                <ApiCard
                    method="POST"
                    path="/api/{agent_id}/{session_id}"
                    description="Invokes the agent with a user query within a specific session."
                >
                    <details className="text-sm cursor-pointer">
                        <summary className="text-gray-400 hover:text-white">Example Body</summary>
                        <pre className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs mt-2 overflow-x-auto">
                            <code>
{`{
    "UserQuery": "Your question here..."
}`}
                            </code>
                        </pre>
                    </details>
                </ApiCard>
                
                <ApiCard
                    method="GET"
                    path="/api/{agent_id}/messages"
                    description="Retrieves message history. A session_id can be provided as a query parameter to filter messages for a specific session."
                />
            </div>
        </div>
    );
};

export default InformationPage;
