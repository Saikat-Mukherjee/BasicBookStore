import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser,FaShoppingCart, FaHeart } from 'react-icons/fa';
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
        <Link to="/">BookStore</Link>    
        {/* <h1>BookStore</h1> */}
      </div>
      <FaSearchComponent onSearch={onSearch} />
      <div className="flex items-center space-x-4">
        <Link to="/cart" className="flex items-center">
          <FaShoppingCart className="text-2xl" />
          <span className="ml-2">Cart</span>
        </Link>
        <Link to="/wishlist" className="flex items-center">
          <FaHeart className="text-2xl" />
          <span className="ml-2">Wishlist</span>
        </Link>
        <FaUserComponent />
      </div>
    </header>
    );
};

export default Header;