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

    const handleRemoveFromWishlist = async (bookId) => {

        console.log("Removing book with ID:", bookId);
        try {
            await api.delete(`/watchlist/remove?bookId=${bookId}`);
            setWishlistItems(wishlistItems.filter(item => item.bookId !== bookId));
        }
        catch (error) {
            console.log('Error removing from wishlist:', error);
        }
    };

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
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h2>
            {wishlistItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-300 mb-4">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500 text-xl">Your wishlist is empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((book) => (
                        <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {book.imageUrl ? (
                                <img className="h-48 w-full object-cover" src={book.imageUrl} alt={book.title} />
                            ) : (
                            <div className="h-48 bg-gray-100 flex items-center justify-center">
                                {/* Placeholder for book image */}
                                <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                            </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{book.title}</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-4">${book.currentPrice}</p>
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                                        Add to Cart
                                    </button>
                                    <button onClick={() => handleRemoveFromWishlist(book.bookId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;