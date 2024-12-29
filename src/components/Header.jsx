import React from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import FaSearchComponent from './FaSearchComponent';
import FaUserComponent from './FaUserComponent';
import api from '../services/api';

const Header = () => {

    const onSearch = (results) => {
        console.log(results);
        api.get(`/books/search?keyword=${results}`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
        });
    };

    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <div className="text-2xl font-bold">
                <h1>BookStore</h1>
            </div>
            <FaSearchComponent onSearch={onSearch}/>
            <div className="ml-4">
                {/* <FaUser className="text-2xl" /> */}
                <FaUserComponent />
            </div>
        </header>
    );
};

export default Header;