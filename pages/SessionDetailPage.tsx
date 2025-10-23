
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Message, MessageRole } from '../types';
import { getMessagesForSession } from '../services/mockApi';

const SessionDetailPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            if (sessionId) {
                setLoading(true);
                const data = await getMessagesForSession(parseInt(sessionId, 10));
                setMessages(data);
                setLoading(false);
            }
        };
        fetchMessages();
    }, [sessionId]);

    if (loading) return <div className="text-center p-4">Loading messages...</div>;
    if (!sessionId) return <div>Session ID not found.</div>

    return (
        <div className="container mx-auto">
            <div className="flex items-center mb-6">
                 <Link to="/sessions" className="text-indigo-400 hover:text-indigo-300 mr-4">&larr; Back to Sessions</Link>
                <h1 className="text-3xl font-bold">Session #{sessionId}</h1>
            </div>
            
            <div className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
                {messages.map(message => (
                    <div key={message.id} className={`flex ${message.role === MessageRole.User ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-4 rounded-lg ${message.role === MessageRole.User ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs text-right mt-2 opacity-60">
                                {new Date(message.datetime).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionDetailPage;
