import React,{useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser,FaShoppingCart, FaHeart } from 'react-icons/fa';
import FaSearchComponent from './FaSearchComponent';
import FaUserComponent from './FaUserComponent';
import api from '../services/api';
import { UserContext } from '../App';



const Header = () => {
    const {user,setUser} = useContext(UserContext);
    console.log(user);

      useEffect(() => {
        async function getUser() {
          try {
            let response = await api.get('/users/profile');
            console.log(response);
            if(response.status === 401){
              setUser(null);
              return;
            }
            else if(typeof(response.data) === 'string'){
              setUser(null);
              return;
            }
            let profile = response.data
            setUser(profile);
          } catch (error) {
            console.error(error);
          }

        }

        getUser();

    }, []);

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
        <Link to="/cart/f7cbb32b-7069-4ac6-9eb3-2ac650f74d50" className="flex items-center">
          <FaShoppingCart className="text-2xl" />
          <span className="ml-2">Cart</span>
        </Link>
        <Link to="/wishlist" className="flex items-center">
          <FaHeart className="text-2xl" />
          <span className="ml-2">Wishlist</span>
        </Link>
        <Link to="/profile" className="flex items-center">
          <FaUserComponent />
          {user ? (<span className="ml-2">{user.username}</span>)
            : (<span className="ml-2">Sign in</span>) }
        </Link>
      </div>
    </header>
    );
};

export default Header;