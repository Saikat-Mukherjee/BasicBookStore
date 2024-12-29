import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { logoutUser } from '../services/auth';
 

const FaUserComponent = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const onLogout = () => {
        logoutUser(navigate);
    }

    return (
        <div className="relative">
            <FaUser className="text-2xl cursor-pointer" onClick={toggleDropdown} />
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Profile</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Settings</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={onLogout}>Logout</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FaUserComponent;