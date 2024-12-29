import React from 'react';

const Cart = ({ cartItems, onRemove }) => {
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <h2>{item.title}</h2>
                            <p>Author: {item.author}</p>
                            <p>Price: ${item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => onRemove(item.id)}>Remove</button>
                        </div>
                    ))}
                    <h2>Total Price: ${getTotalPrice().toFixed(2)}</h2>
                </div>
            )}
        </div>
    );
};

export default Cart;