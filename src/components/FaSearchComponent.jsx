import React, { useState } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';

const FaSearchComponent = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        setQuery(e.target.value);
       /*  const results = data.filter(item =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.author.toLowerCase().includes(e.target.value.toLowerCase())
        ); */
        onSearch(query);
    };

    return (
        <div className="flex items-center w-full max-w-lg mx-auto">
            <input className="p-4 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                type="text"
                placeholder="Search for books or authors..."
                value={query}
                onChange={handleSearch}
            />
            <button
                type="submit"
                className="p-4 bg-blue-500 rounded-r-md hover:bg-blue-600 text-white"
                style={{ height: '100%' }}
            >
                <FaSearch />
            </button>
        </div>
    );
};

export default FaSearchComponent;