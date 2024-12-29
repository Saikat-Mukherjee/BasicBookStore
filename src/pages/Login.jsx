import React, { useState } from 'react';
import { Link, redirect,useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit =async (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', name);
        console.log('Password:', password);
    
        try {
            const token = await loginUser(name, password);
            console.log('Login successful:', token);
            // Redirect to home page
            navigate('/');
          } catch (error) {
            console.error('Login failed:', error);
            navigate("/login");
          }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                       <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Username:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">Login</button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;