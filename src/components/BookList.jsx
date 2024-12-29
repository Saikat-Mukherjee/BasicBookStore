import React from 'react';

function BookList({ books }) {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Book List</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {!books || books.length === 0 ? (
                    <p className="col-span-full text-center">No books available</p>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                            <p className="text-gray-700 mb-1">{book.author}</p>
                            <p className="text-gray-600">{book.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default BookList;