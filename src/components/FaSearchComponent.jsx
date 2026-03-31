import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserContext } from '../App';

const FaSearchComponent = () => {
    const { user } = useContext(UserContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                fetchResults();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/search/quick?q=${query}`);
            setResults(response.data || []);
            setShowResults(true);
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (query.trim()) {
            setShowResults(false);
            // Optional: Navigate to a full search results page if implemented
            // navigate(`/search?q=${query}`);
        }
    };

    const handleResultClick = (id) => {
        navigate(`/product/${id}`);
        setShowResults(false);
        setQuery('');
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                        placeholder={user ? "Search for books, authors, or ISBNs..." : "Sign in to search..."}
                        value={query}
                        onChange={(e) => {
                            if (user) setQuery(e.target.value);
                        }}
                        onFocus={() => {
                            if (!user || results.length > 0) setShowResults(true);
                        }}
                        readOnly={!user}
                    />
                    {query && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={clearSearch}
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            </form>

            {/* Dropdown Results */}
            {showResults && (!user || query.trim() !== '') && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    {!user ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            <p className="mb-2">Please sign in to search for books.</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign In
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                    ) : results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((book) => (
                                <li
                                    key={book.id || book._id}
                                    onClick={() => handleResultClick(book.id || book._id)}
                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors duration-150 border-b border-gray-50 last:border-none"
                                >
                                    {book.coverImage && (
                                        <img 
                                            src={book.coverImage} 
                                            alt={book.title} 
                                            className="w-10 h-14 object-cover rounded shadow-sm"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {book.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {typeof book.author === 'object' ? book.author.name : book.author}
                                        </p>
                                    </div>
                                    {book.price && (
                                        <div className="text-sm font-semibold text-blue-600">
                                            ${book.price}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FaSearchComponent;