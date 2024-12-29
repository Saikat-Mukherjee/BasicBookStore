import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from './components/Header';

const Layout = () => {
    return (
        <div>
           <Header/>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>&copy; 2023 BookStore. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;