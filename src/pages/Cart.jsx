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
          const response = await api.get(`/cart/all?userId=${userId}`);
          const data = response.data;
          console.log(data);

          setCartItems(data[0].bookList);
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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>
            {cartItems.length === 0 ? (
               <p className="text-gray-500">No items in the cart</p>
            ) : (
                <>
                <ul className="space-y-4">
                {cartItems.map(item => (
              <li key={item.bookId} className="flex justify-between items-center p-4 border rounded shadow">
                <span>{item.title} - ${item.price}</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onDecreaseQuantity(item.bookId)} 
                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => onIncreaseQuantity(item.bookId)} 
                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => onRemove(item.bookId)} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
              </ul>
                <div className="mt-4 text-right">
                    <span className="text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</span>
                </div>
            </>
            )}
        </div>
    );
};

export default Cart;