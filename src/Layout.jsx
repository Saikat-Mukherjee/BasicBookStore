import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './components/Header';
import ChatBot from './components/chatbot';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
           <Header/>
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
                <ChatBot />
            </main>
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;