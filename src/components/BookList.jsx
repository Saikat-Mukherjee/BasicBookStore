import React from 'react';
import { Link } from 'react-router-dom';

function BookList({ books }) {
    console.log(books);
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {!books || books.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No books available at the moment.</p>
                    </div>
                ) : (
                    books.map((book) => (
                        <div key={book.isbn} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                            <div className="relative h-64 bg-gray-100 overflow-hidden">
                                {book.imageUrl ? (
                                    <img 
                                        src={book.imageUrl} 
                                        alt={book.title} 
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                        ${book.price}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="mb-4 flex-grow">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={book.title}>{book.title}</h3>
                                    <p className="text-sm text-blue-600 font-medium mb-2">{book.author.name}</p>
                                    <p className="text-gray-500 text-sm line-clamp-3">{book.description}</p>
                                </div>
                                <Link 
                                    to={`/product/${book.isbn}`} 
                                    className="block w-full text-center bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default BookList;