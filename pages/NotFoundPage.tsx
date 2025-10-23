
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="text-center">
            <h1 className="text-6xl font-bold text-indigo-400">404</h1>
            <p className="text-2xl mt-4">Page Not Found</p>
            <p className="mt-2 text-gray-400">Sorry, the page you are looking for does not exist.</p>
            <Link to="/agents" className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default NotFoundPage;
