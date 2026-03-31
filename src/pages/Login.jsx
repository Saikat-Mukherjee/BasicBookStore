import React, { useState, useContext } from 'react';
import { Link, redirect,useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { UserContext } from '../App';
import api from '../services/api';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit =async (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', name);
        console.log('Password:', password);
    
        try {
            const token = await loginUser(name, password);
            console.log('Login successful:', token);
            
            // Fetch user profile after successful login
            try {
                const response = await api.get('/users/profile');
                if (response.status === 200 && typeof response.data !== 'string') {
                    setUser(response.data);
                }
            } catch (profileError) {
                console.error('Error fetching profile:', profileError);
            }

            // Redirect to home page
            navigate('/');
          } catch (error) {
            console.error('Login failed:', error);
            navigate("/login");
          }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your password"
                        />
                    </div>
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