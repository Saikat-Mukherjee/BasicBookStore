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

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md text-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
                    <Link to="/" className="flex items-center gap-2 hover:text-blue-700 transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        BookStore
                    </Link>    
                </div>
                
                <div className="flex-1 max-w-xl mx-8">
                    <FaSearchComponent />
                </div>

                <div className="flex items-center space-x-6">
                    <Link to="/cart/f7cbb32b-7069-4ac6-9eb3-2ac650f74d50" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group">
                        <div className="relative">
                            <FaShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
                            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
                        </div>
                        <span className="ml-2 font-medium hidden md:block">Cart</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center text-gray-600 hover:text-red-500 transition-colors group">
                        <FaHeart className="text-2xl group-hover:scale-110 transition-transform" />
                        <span className="ml-2 font-medium hidden md:block">Wishlist</span>
                    </Link>
                    
                    {user ? (
                        <FaUserComponent user={user} setUser={setUser} />
                    ) : (
                        <Link to="/login" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group">
                            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <FaUser />
                            </div>
                            <span className="ml-2 font-medium">Sign in</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;