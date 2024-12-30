import React from 'react';
import { useParams } from 'react-router-dom';
const ProductPage = () => {
    const { id } = useParams();
    console.log("Product Id is =>",id);

    const product = {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby and his unrequited love for Daisy Buchanan.',
        price: 10.99,
        imageUrl: 'https://example.com/great-gatsby.jpg'
    };

    return (
        <div className="product-page p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <h2 className="text-xl text-gray-700">by {product.author}</h2>
            <img className="w-full h-auto rounded" src={product.imageUrl} alt={product.title} />
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-semibold">Price: ${product.price}</p>
        <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add to Cart</button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">Add to Wishlist</button>
        </div>
        </div>
    );
};

export default ProductPage;