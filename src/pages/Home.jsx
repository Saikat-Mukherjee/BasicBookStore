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
        <div>
            <h1>Welcome to the Bookstore</h1>
            {error && <p className="text-red-500">Error: {error}</p>}
            <BookList books={books} />
        </div>
    );
}

export default Home;