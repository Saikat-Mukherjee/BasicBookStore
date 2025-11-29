import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaBox, FaHeart, FaQuestionCircle, FaChevronDown } from 'react-icons/fa';
import { logoutUser } from '../services/auth';

const FaUserComponent = ({ user, setUser }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const onLogout = () => {
        logoutUser(navigate);
        setUser(null);
        setDropdownOpen(false);
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="font-bold text-lg">{user?.username?.charAt(0).toUpperCase() || <FaUser />}</span>
                    )}
                </div>
                <span className="font-medium hidden md:block max-w-[100px] truncate">{user?.username}</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all duration-200 ease-out">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                        <Link 
                            to="/profile" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaUser className="mr-3 text-gray-400" />
                            My Profile
                        </Link>
                        <Link 
                            to="/orders" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaBox className="mr-3 text-gray-400" />
                            My Orders
                        </Link>
                        <Link 
                            to="/wishlist" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaHeart className="mr-3 text-gray-400" />
                            Wishlist
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                        <Link 
                            to="/settings" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaCog className="mr-3 text-gray-400" />
                            Settings
                        </Link>
                        <Link 
                            to="/help" 
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <FaQuestionCircle className="mr-3 text-gray-400" />
                            Help & Support
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                        <button 
                            onClick={onLogout}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <FaSignOutAlt className="mr-3" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaUserComponent;
