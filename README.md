# Agents Simulator

Agents Simulator is a comprehensive web application designed to create, manage, test, and deploy AI agents. It provides a user-friendly interface for configuring agents with different models (like Gemini, GPT, etc.) and tools, along with features for session management, message tracking, user administration, and a robust API for programmatic integration.

## Core Features

-   **Agent Management:** Create, edit, and delete AI agents with custom system prompts, models, and tool configurations.
-   **Live Testing:** An integrated test panel to interact with and debug agents in real-time.
-   **User & Session Tracking:** Manage users, track agent-user interaction sessions, and review message histories.
-   **Extensible Tool System:** Define tools for agents, including API calls, CLI commands, or even other agents.
-   **Robust API:** Secure API endpoints to integrate agent functionality into other applications.
-   **Detailed Logging:** Comprehensive logging for model interactions, agent changes, and API usage.
-   **API Documentation:** Built-in information page with endpoint details and a downloadable Postman collection.

## Technology Stack

-   **Backend:** Apache + PHP 8.4 (with `mod_php`)
-   **Database:** MongoDB
-   **Frontend:** React, TypeScript, React Router, TailwindCSS
-   **Environment:** Docker (for the database)

## Local Development Setup

Follow these steps to get the Agents Simulator running on your local machine.

### Prerequisites

-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
-   [Node.js](https://nodejs.org/en/) (v18 or later) and npm
-   An Apache + PHP 8.4 development environment (e.g., XAMPP, WAMP, or a custom setup)

### Step 1: Clone the Repository

```bash
git clone <repository_url>
cd agents-simulator
```

### Step 2: Start the Database

The project uses Docker to run a MongoDB instance, ensuring a consistent database environment.

```bash
docker-compose up -d
```

This command starts a MongoDB container in the background. The database will be accessible on `mongodb://localhost:27017`.

### Step 3: Initialize the Database

Next, run the setup script to create the necessary collections, define indexes, and insert the initial admin user.

First, install the required Node.js dependencies:

```bash
npm install
```

Then, run the initialization script:

```bash
node db_setup.js
```

You should see confirmation messages in your terminal. Your database is now ready. For more details, see the `DATABASE_SETUP.md` file.

### Step 4: Configure the Backend

1.  **Set up Apache:** Configure an Apache virtual host to point to the root directory of this project. The document root should be the project's main folder where `index.html` resides.
2.  **API Implementation:** The PHP backend API logic needs to be implemented. This will involve creating PHP files to handle requests for the API routes defined in `PROMPT.md` (e.g., `/api/{agent_id}/{session_id}`). These scripts will connect to the MongoDB database to perform the required operations.

### Step 5: Run the Frontend

The frontend is a single-page application built with React. For development, you can open the `index.html` file directly in your browser, or preferably, serve it through your configured Apache server.

-   Navigate to the URL of your Apache virtual host (e.g., `http://agents-simulator.test`).
-   You should be greeted with the login screen. Use the default credentials to log in:
    -   **Username:** `satish`
    -   **Password:** `satish`

## API Usage

The application exposes a set of RESTful API endpoints for programmatic interaction.

-   All requests must be authenticated using a Bearer Token in the `Authorization` header.
-   Tokens can be generated and managed from the "Edit User" page for any user.
-   For detailed endpoint information and a ready-to-use Postman collection, navigate to the **Information** page within the application.
