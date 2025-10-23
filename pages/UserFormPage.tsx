
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, AuthorizationToken } from '../types';
import { getUser, createUser, updateUser, addToken, deleteToken } from '../services/mockApi';

// Component defined outside to prevent re-creation on re-renders
const TokenManager: React.FC<{ tokens: AuthorizationToken[], userId: number, onTokenChange: () => void }> = ({ tokens, userId, onTokenChange }) => {
    
    const handleAddToken = async () => {
        await addToken(userId);
        onTokenChange();
    };

    const handleDeleteToken = async (tokenId: number) => {
        if(window.confirm('Are you sure you want to delete this token?')) {
            await deleteToken(tokenId);
            onTokenChange();
        }
    };

    return (
        <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">API Tokens</h3>
                <button type="button" onClick={handleAddToken} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm">
                    Generate Token
                </button>
            </div>
            <div className="space-y-2">
                {tokens.map(token => (
                    <div key={token.id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                        <code className="text-sm text-gray-400 truncate">{token.token}</code>
                        <div className="flex items-center space-x-3">
                           <span className={`text-xs px-2 py-1 rounded-full ${token.active ? 'bg-green-800 text-green-300' : 'bg-red-800 text-red-300'}`}>
                                {token.active ? 'Active' : 'Inactive'}
                           </span>
                           <button type="button" onClick={() => { /* In mock API, toggle is not implemented */}} className="text-yellow-400 hover:text-yellow-300 text-sm">
                                {token.active ? 'Disable' : 'Enable'}
                           </button>
                           <button type="button" onClick={() => handleDeleteToken(token.id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const UserFormPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(userId);

    const [user, setUser] = useState<Partial<User>>({ name: '', username: '', password: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUser = async () => {
        if (isEditing && userId) {
            setLoading(true);
            const existingUser = await getUser(parseInt(userId, 10));
            if (existingUser) {
                setUser({ ...existingUser, password: '' }); // Don't prefill password
            } else {
                navigate('/404');
            }
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, isEditing, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user.password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');

        if (isEditing && userId) {
            await updateUser(parseInt(userId, 10), user);
        } else {
            await createUser(user);
        }
        navigate('/users');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit User' : 'Create User'}</h1>
            {error && <p className="bg-red-900 text-red-300 p-3 rounded mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Name</label>
                    <input type="text" name="name" value={user.name || ''} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Username</label>
                    <input type="text" name="username" value={user.username || ''} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Password</label>
                    <input type="password" name="password" value={user.password || ''} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-gray-600" placeholder={isEditing ? 'Leave blank to keep current password' : ''} />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                </div>

                {isEditing && user.tokens && user.id && (
                    <div className="mb-6">
                        <TokenManager tokens={user.tokens} userId={user.id} onTokenChange={fetchUser} />
                    </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition-colors duration-300">
                    {isEditing ? 'Update User' : 'Create User'}
                </button>
            </form>
        </div>
    );
};

export default UserFormPage;
