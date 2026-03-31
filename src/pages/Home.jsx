import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from '../components/BookList';
import api from '../services/api';

function Home() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
       /*  axios.get('http://192.168.10.6:8080/books/all', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin'),
            },
            withCredentials: true,
        })
        .then((response) => {
            console.log(response.data);
            setBooks(response.data);
        })
        .catch((error) => {
            console.log('Error:', error);
            setError(error.message);
        }); */
        const fetchBooks = async () => {
            try {
              const response = await api.get('/books/all');
              console.log(response.data);
              setBooks(response.data);
            } catch (error) {
              console.log('Error:', error);
              setError(error.message);
            }
          };
      
          fetchBooks();
          
    }, []);

    return (
        <div className="space-y-8">
            <section className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Welcome to BookStore</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover your next favorite adventure from our extensive collection of books.</p>
            </section>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <strong className="font-medium">Error: </strong>
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Books</h2>
                <BookList books={books} />
            </div>
        </div>
    );
}

export default Home;