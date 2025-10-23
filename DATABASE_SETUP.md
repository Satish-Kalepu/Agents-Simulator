# Database Setup Guide

This document provides instructions on how to set up the MongoDB database for the Agents Simulator project.

## Prerequisites

- [Node.js](https://nodejs.org/) (for running the setup script)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (for the recommended setup)

---

## 1. Installation using Docker (Recommended)

Using Docker is the simplest way to get a MongoDB instance running for this project.

1.  **Start the Database Container:**
    From the root directory of the project, run the following command:
    ```sh
    docker-compose up -d
    ```
    This command will download the official MongoDB image and start a container named `agents-simulator-db` running in the background. The database will be accessible on `localhost:27017`.

---

## 2. Manual Installation

If you prefer not to use Docker, you can install MongoDB Community Server directly on your system. Follow the official installation guide for your operating system:

- [Install MongoDB Community Edition](https://www.mongodb.com/docs/manual/installation/)

---

## 3. Initializing the Schema & Data

After setting up the MongoDB instance (either via Docker or manually), you need to run the initialization script. This script will create the necessary collections, define indexes, and insert the initial data (e.g., the default admin user).

1.  **Install Dependencies:**
    Open your terminal in the project's root directory and install the MongoDB driver:
    ```sh
    npm install
    ```

2.  **Run the Setup Script:**
    Execute the script using Node.js:
    ```sh
    node db_setup.js
    ```

You should see log messages indicating that the collections and indexes were created successfully and the initial data was inserted. Your database is now ready.

---

## 4. Connecting the Application

**Note:** The current frontend application (`/src`) is configured to use a mock API (`src/services/mockApi.ts`) for demonstration and development purposes.

To connect the application to the MongoDB database you just set up, you would need to build out the backend API layer (e.g., using PHP as per the project requirements) that performs the database operations. That backend would use the connection string `mongodb://localhost:27017/agents_simulator`.
