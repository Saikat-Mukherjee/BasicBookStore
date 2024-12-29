import React from 'react';

const Wishlist = ({ wishlist }) => {
    return (
        <div>
            <h1>Wishlist</h1>
            {wishlist.length === 0 ? (
                <p>No books in wishlist</p>
            ) : (
                <ul>
                    {wishlist.map((book) => (
                        <li key={book.id}>
                            <h2>{book.title}</h2>
                            <p>{book.author}</p>
                            <p>Price: ${book.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Wishlist;