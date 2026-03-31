import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
const ProductPage = () => {
    const { id } = useParams();
    console.log("Product Id is =>",id);
   // const [product, setProduct] = useState({});
    const [book, setBook] = useState({});
    const [error, setError] = useState(null);
    const [isWishlist, setIsWishlist] = useState(false);
    const [cartItem, setCartItem] = useState(null);

    /* const product = {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby and his unrequited love for Daisy Buchanan.',
        price: 10.99,
        imageUrl: 'https://example.com/great-gatsby.jpg'
    }; */
    useEffect(() => {
        console.log("Product Id is =>", id);
        // fetch product data from API
        const fetchBookDetails = async (bookId) => {
            try {
             /*  const response1 = await api.get('/Sellers/seller?id='+bookId);
              console.log(response1.data);
              setProduct(response1.data); */
              //const response = await api.get('/books/book?id='+bookId);
              const response = await api.get('/books/id?id='+bookId);
              console.log("Book ",response.data);
                setBook(response.data);
            } catch (error) {
              console.log('Error:', error);
              setError(error.message);
            }
          };

        const fetchCartDetails = async (bookId) => {
            try {
              const response = await api.get(`/cart/item?bookId=${bookId}`);
                console.log("Cart item details: ",response.data);
                if(response.data) {
                    setCartItem(response.data);
                } else {
                    setCartItem(null);
               }

            } catch (error) {
              console.log('Error:', error);
            }
      } ;

          const checkIfBookInWishlist = async (bookId) => {
            try {
                //let hardcodedBookId = "1d954a8d-b026-43eb-87bf-f88983ef0fd1"; // Replace with actual user ID from auth context or state
              const response = await api.get('/watchlist/checkBook/'+bookId);
                console.log("Is book in wishlist? ",response.data);
                setIsWishlist(response.data);
            } catch (error) {
              console.log('Error:', error);
            }
          };

          checkIfBookInWishlist(id);
          fetchBookDetails(id);
          fetchCartDetails(id);

    }, [id]);

    const handleAddToWishlist = async () => {
        try {
            await api.post('/watchlist/add',{ bookId: id });
            setIsWishlist(true);
        } catch (error) {
            console.log('Error adding to wishlist:', error);
        }
    };

    const handleRemoveFromWishlist = async () => {
        try {
            await api.delete(`/watchlist/remove?bookId=${id}`);
            setIsWishlist(false);
        } catch (error) {
            console.log('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = async () => {
        try {
            await api.post('/cart/add',{ bookId: id, quantity: 1 });
            setCartItem({ bookId: id, quantity: 1 }); // Update cart item state to reflect addition
        } catch (error) {
            console.log('Error adding to cart:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden my-8">
            <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/2 bg-gray-50 flex items-center justify-center p-12">
                    {book.imageUrl ? (
                        <img className="h-96 w-auto object-contain shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-300" src={book.imageUrl} alt={book.title} />
                    ) : (
                        <div className="h-96 w-64 bg-gray-200 rounded-lg shadow-inner flex items-center justify-center text-gray-400">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                        </div>
                    )}
                </div>
                <div className="p-10 md:w-1/2 flex flex-col justify-center">
                    <div className="uppercase tracking-wide text-sm text-blue-600 font-bold mb-2">{book.category || 'Book'}</div>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{book.title}</h1>
                    <div className="flex items-center mb-6">
                        <span className="text-gray-600 text-lg mr-2">by</span>
                        <span className="text-gray-900 text-lg font-semibold">{book.author?.name || book.author || 'Unknown Author'}</span>
                    </div>
                    
                    <div className="flex items-baseline mb-8">
                        <span className="text-4xl font-bold text-gray-900">${book.price}</span>
                        {/* <span className="ml-4 text-lg text-gray-500 line-through">$15.99</span> */}
                    </div>

                    <div className="prose prose-blue text-gray-600 mb-8 leading-relaxed">
                        {book.description || 'No description available for this book.'}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {cartItem ? (
                            <button className="flex-1 bg-gray-600 text-white px-8 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4
                                0 2 2 0 014 0z"></path></svg>
                                In Cart
                            </button>
                        ) : (
                            <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4
                                0 2 2 0 014 0z"></path></svg>
                                Add to Cart
                            </button>
                        )}
                        
                        {isWishlist ? (
                            <button onClick={handleRemoveFromWishlist} className="flex-1 bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z} "></path></svg>
                                Remove from Wishlist
                            </button>
                        ) : (
                        <button onClick={handleAddToWishlist} className="flex-1 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            Add to Wishlist
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;