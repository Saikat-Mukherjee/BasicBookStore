import React,{useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
const Cart = () => {
  const { userId } = useParams();
  console.log("User Id is =>",userId);
  const [cartItems, setCartItems] = useState([]);
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

/* const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Book 1', price: 10 , quantity: 1},
    { id: 2, name: 'Book 2', price: 15 , quantity: 1},
    { id: 3, name: 'Book 3', price: 20 , quantity: 1},
    ]); */

    useEffect(() => {
      const fetchCart = async (userId) => {
        try {
          //const response = await api.get(`/cart/all?userId=${userId}`);
          const response = await api.get(`/cart/all`);
          const data = response.data;
          console.log(data);

          //setCartItems(data[0].bookList);
          setCartItems(data[0].items);
          console.log(cartItems.length);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
      fetchCart(userId);
    }, [userId]);

    const onRemove = (itemId) => {
      setCart(cartItems.filter(item => item.bookId !== itemId));
    };

    const onIncreaseQuantity = (itemId) => {
      setCartItems(cartItems.map(item => 
        item.bookId === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    };
  
    const onDecreaseQuantity = (itemId) => {
      setCartItems(cartItems.map(item => 
        item.bookId === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ));
    };
    console.log(cartItems);

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h2>
            {cartItems.length === 0 ? (
               <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                   <div className="text-gray-300 mb-4">
                       <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                       </svg>
                   </div>
                   <p className="text-gray-500 text-xl mb-6">Your cart is currently empty</p>
                   <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                       Start Shopping
                   </a>
               </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-grow space-y-4">
                        {cartItems.map(item => (
                            <div key={item.bookId} className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
                                    {/* Placeholder for book image if available in item */}
                                    <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-blue-600 font-bold">${item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button 
                                            onClick={() => onDecreaseQuantity(item.bookId)} 
                                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border-r border-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 font-medium text-gray-700 min-w-[2.5rem] text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => onIncreaseQuantity(item.bookId)} 
                                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border-l border-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => onRemove(item.bookId)} 
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;