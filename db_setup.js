// This script initializes the MongoDB database for the Agents Simulator project.
// It creates collections, sets up indexes, and inserts initial seed data.

const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'agents_simulator';

async function main() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        const db = client.db(dbName);

        // Drop existing collections to ensure a clean slate
        console.log('Dropping existing collections...');
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            await db.collection(collection.name).drop();
        }

        console.log('Creating collections and indexes...');

        // Agents Collection
        const agentsCollection = db.collection('agents');
        await agentsCollection.createIndex({ name: 1 });
        console.log('- "agents" collection created.');

        // Sessions Collection
        const sessionsCollection = db.collection('sessions');
        await sessionsCollection.createIndex({ agent_id: 1 });
        console.log('- "sessions" collection created.');

        // Messages Collection
        const messagesCollection = db.collection('messages');
        await messagesCollection.createIndex({ agent_id: 1 });
        await messagesCollection.createIndex({ session_id: 1 });
        console.log('- "messages" collection created.');

        // ModelLog Collection
        const modelLogCollection = db.collection('modelLogs');
        await modelLogCollection.createIndex({ agent_id: 1 });
        await modelLogCollection.createIndex({ session_id: 1 });
        await modelLogCollection.createIndex({ message_id: 1 });
        console.log('- "modelLogs" collection created.');

        // AgentTestLog Collection
        const agentTestLogCollection = db.collection('agentTestLogs');
        await agentTestLogCollection.createIndex({ agent_id: 1 });
        console.log('- "agentTestLogs" collection created.');
        
        // AgentChangeLog Collection
        const agentChangeLogCollection = db.collection('agentChangeLogs');
        await agentChangeLogCollection.createIndex({ user_id: 1 });
        await agentChangeLogCollection.createIndex({ agent_id: 1 });
        console.log('- "agentChangeLogs" collection created.');

        // Users Collection
        const usersCollection = db.collection('users');
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        console.log('- "users" collection created.');

        // AuthorizationTokens Collection
        const tokensCollection = db.collection('authorizationTokens');
        await tokensCollection.createIndex({ token: 1 }, { unique: true });
        await tokensCollection.createIndex({ user_id: 1 });
        console.log('- "authorizationTokens" collection created.');


        console.log('\nInserting initial data...');

        // Insert initial user
        // In a real application, passwords should be securely hashed.
        const initialUser = {
            _id: 1,
            name: "Satish Kalepu",
            username: "satish",
            password: "satish", // IMPORTANT: This should be hashed in a real application
            created_date: new Date("2025-10-22T10:10:10Z"),
            last_login_date: null
        };
        await usersCollection.insertOne(initialUser);
        console.log('- Initial user "satish" inserted.');
        
        console.log('\nDatabase initialization complete!');

    } catch (err) {
        console.error('An error occurred during database initialization:', err);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

main().catch(console.error);
