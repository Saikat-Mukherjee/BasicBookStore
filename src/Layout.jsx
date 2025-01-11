import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './components/Header';
import ChatBot from './components/chatbot';

const Layout = () => {
    return (
        <div>
           <Header/>
            <main>
                <Outlet />
                <ChatBot />
            </main>
            <footer>
                <p>&copy; 2023 BookStore. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;