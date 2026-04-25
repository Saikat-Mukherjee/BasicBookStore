import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { UserContext } from '../App';
import api from '../services/api';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useContext(UserContext);

    const sessionExpired = new URLSearchParams(location.search).get('session') === 'expired';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const token = await loginUser(name, password);
            
            // Fetch user profile after successful login
            try {
                const response = await api.get('/users/profile');
                if (response.status === 200 && typeof response.data !== 'string') {
                    setUser(response.data);
                }
            } catch (profileError) {
                console.error('Error fetching profile:', profileError);
            }

            navigate('/');
        } catch (error) {
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                setError('Incorrect username or password. Please try again.');
            } else if (status === 404) {
                setError('Account not found. Please check your username.');
            } else {
                setError('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Welcome Back</h2>
                {sessionExpired && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm px-4 py-3 rounded-lg mb-4">
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        Your session has expired. Please sign in again.
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(''); }}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg">
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;