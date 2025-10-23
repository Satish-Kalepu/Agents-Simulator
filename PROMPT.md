# Agents Simulator Project Specification

## 1. Project Overview

**Project Name:** Agents Simulator

**Description:** A comprehensive web application to create, manage, test, and deploy AI agents. It provides a user-friendly interface for agent configuration, session management, and message tracking, along with a robust API for programmatic integration. The platform includes user management and detailed logging for monitoring and auditing.

## 2. Technology Stack

*   **Backend:** Apache + PHP 8.4 (with `mod_php`)
*   **Database:** MongoDB
*   **Frontend:** React, TypeScript, TailwindCSS
*   **Environment:** Docker (via `docker-compose.yml`)

## 3. Database Schema (MongoDB)

**Database Name:** `agents_simulator`

### Collections

1.  **agents**
    *   `id` (int, primary)
    *   `name` (text)
    *   `description` (text)
    *   `model` (text)
    *   `system_prompt` (text)
    *   `tools` (json object)
    *   `created_date` (datetime)
    *   `updated_date` (datetime)
    *   `last_used_date` (datetime)
    *   `invocations` (int)

2.  **sessions**
    *   `id` (int, primary)
    *   `agent_id` (int)
    *   `created_date` (datetime)
    *   `last_used_date` (datetime)
    *   `invocations` (int)
    *   **Index:** `agent_id`

3.  **messages**
    *   `id` (int, primary)
    *   `agent_id` (int)
    *   `session_id` (int)
    *   `datetime` (datetime)
    *   `role` (string: 'user' | 'assistant')
    *   `message` (text)
    *   **Indexes:** `agent_id`, `session_id`

4.  **modelLogs**
    *   `id` (int, primary)
    *   `datetime` (datetime)
    *   `model` (text)
    *   `agent_id` (int)
    *   `session_id` (int)
    *   `message_id` (int)
    *   `apiRequest` (object)
        *   `url` (string)
        *   `method` (string)
        *   `headers` (object)
        *   `body` (string) - Raw JSON string payload
    *   `apiResponse` (object)
        *   `statusCode` (int)
        *   `headers` (object)
        *   `body` (string) - Raw JSON string payload
    *   `user_query` (text)
    *   `agent_response` (text)
    *   `duration` (number, in ms)
    *   `tokens` (int)
    *   `input_tokens` (int)
    *   `output_tokens` (int)
    *   **Indexes:** `agent_id`, `session_id`, `message_id`

5.  **agentTestLogs**
    *   `id` (int, primary)
    *   `agent_id` (int)
    *   `datetime` (datetime)
    *   `query` (text)
    *   `response` (text)

6.  **users**
    *   `id` (int, primary)
    *   `name` (text)
    *   `username` (text, unique)
    *   `password` (text, hashed)
    *   `created_date` (datetime)
    *   `last_login_date` (datetime)
    *   **Initial Record:** `{"id":1, "name": "Satish Kalepu", "username": "satish", "password": "satish", ...}`

7.  **agentChangeLogs**
    *   `id` (int, primary)
    *   `user_id` (int)
    *   `agent_id` (int)
    *   `datetime` (datetime)
    *   `event` (string: 'create' | 'edit' | 'delete')
    *   `description` (text)

8.  **authorizationTokens**
    *   `id` (int, primary)
    *   `user_id` (int)
    *   `agent_id` (int)
    *   `token` (text, unique)
    *   `active` (boolean)
    *   `created_date` (datetime)
    *   `last_used_date` (datetime)
    *   `expire_date` (datetime)
    *   `invocations` (int)
    *   `max_invocations` (int)
    *   **Unique Index:** `token`

### `tools` Field Schema

```json
[
    {
        "name": "name of tool",
        "type": "MCP",
        "mcp_type": "url",
        "url": "",
        "authorization_header": ""
    },
    {
        "name": "name of tool",
        "type": "MCP",
        "mcp_type": "command",
        "command": "",
        "parameters": ""
    },
    {
        "name": "name of tool",
        "type": "API",
        "url": "",
        "authorization_header": ""
    },
    {
        "name": "name of tool",
        "type": "Agent",
        "agent_id": "",
        "agent_name": ""
    }
]
```

## 4. URL and Page Structure

*   `/`: Login form.
*   `/agents`: List of all agents (view, edit, delete).
*   `/agent/create`: Form to create a new agent.
*   `/agent/:agentId`: Form to edit and test an existing agent.
*   `/sessions`: List of all user sessions.
*   `/sessions/:sessionId`: Paginated message history for a specific session.
*   `/messages`: Paginated list of all messages with agent/session filters.
*   `/users`: List of all users (view, edit, delete).
*   `/users/create`: Form to create a new user.
*   `/users/:userId`: Form to edit an existing user and manage API tokens.
*   `/information`: API documentation and Postman collection download.

## 5. API Endpoints

*Authentication is based on an `Authorization: Bearer <token>` header.*

1.  **Invoke Agent**
    *   `POST /api/:agent_id/:session_id`
    *   **Input:** `{"UserQuery": "text or json string"}`
    *   **Action:** Invokes the specified agent using cloud APIs (Gemini, etc.) and logs the interaction.
    *   **Response:** Agent's response in text/json.

2.  **Create Session**
    *   `POST /api/:agent_id/create_session`
    *   **Action:** Creates a new session record for the agent.
    *   **Response:** `{"session_id": "unique_session_id"}`

3.  **Retrieve Messages**
    *   `GET /api/:agent_id/messages`
    *   **Query Params:** `?session_id=<session_id>` (optional)
    *   **Action:** Retrieves message history.
    *   **Response:** Paginated message history in JSON format.

## 6. UI/UX Requirements

### Agent Create/Edit Page (`/agent/...`)

*   **Inputs:** Name, Description, Model (dropdown), System Prompt (markdown editor).
*   **Tools Manager:** A sub-component to add/edit/delete tools (MCP, API, Agent) with context-specific fields.
*   **Test Panel:** A dedicated section with text areas for `UserQuery`, `Response`, and a `pre` tag for logs to test the agent's configuration in real-time.

### User Create/Edit Page (`/users/...`)

*   **Inputs:** Name, Username, Password, Confirm Password.
*   **Token Manager (Edit only):** A sub-component to manage API tokens for the user.
    *   Displays a list of existing tokens.
    *   "Generate Token" button (creates 128-char key).
    *   Enable/Disable and Delete buttons for each token.

### Information Page (`/information`)

*   Provides a clear list and description of all available API endpoints.
*   Features a "Download Postman Collection" button for easy API testing and integration.

## 7. Setup and Installation

*   **Database:** A `docker-compose.yml` file is provided to run a MongoDB instance.
*   **Initialization:** A `db_setup.js` script (run with `npm install` then `node db_setup.js`) connects to the database, creates all collections and indexes, and inserts initial seed data (e.g., the first user).
*   **Instructions:** A `DATABASE_SETUP.md` file details the setup process.