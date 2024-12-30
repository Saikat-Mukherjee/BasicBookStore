import React,{useState} from 'react';

const Cart = () => {
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Book 1', price: 10 , quantity: 1},
    { id: 2, name: 'Book 2', price: 15 , quantity: 1},
    { id: 3, name: 'Book 3', price: 20 , quantity: 1},
    ]);

    const onRemove = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>
            {cartItems.length === 0 ? (
               <p className="text-gray-500">No items in the cart</p>
            ) : (
                <>
                <ul className="space-y-4">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-4 border rounded shadow">
                    <span>{item.name} - ${item.price}</span>
                    <button 
                      onClick={() => onRemove(item.id)} 
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
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