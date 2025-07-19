import React,{useEffect, useState} from 'react';
import { use } from 'react';
import api from '../services/api';

const Wishlist = () => {

    /* const [wishlistItems, setWishlistItems] = useState([
        { id: 1, name: 'Wishlist Book 1', price: 12 },
        { id: 2, name: 'Wishlist Book 2', price: 18 },
        { id: 3, name: 'Wishlist Book 3', price: 25 },
    ]); */

    const [wishlistItems, setWishlistItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch wishlist items from API or local storage if needed
        // For now, we are using hardcoded items
        const fetchWishlistItem = async () => {
            try {
              const response = await api.get('/watchlist/all-lists');
              console.log(response.data);
              setWishlistItems(response.data[0].items);
            } catch (error) {
              console.log('Error:', error);
              setError(error.message);
            }
          };
      
          fetchWishlistItem();

    }, []);

    return (
        <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500">No books in wishlist</p>
        ) : (
          <ul className="space-y-4">
            {wishlistItems.map((book) => (
              <li key={book.id} className="p-4 border rounded shadow">
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p className="text-gray-700">Price: ${book.currentPrice}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default Wishlist;