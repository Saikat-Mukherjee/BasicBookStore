import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
const ProductPage = () => {
    const { id } = useParams();
    console.log("Product Id is =>",id);
    const [product, setProduct] = useState({});
    const [book, setBook] = useState({});
    const [error, setError] = useState(null);

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
              const response1 = await api.get('/Sellers/seller?id='+bookId);
              console.log(response1.data);
              setProduct(response1.data);
              const response = await api.get('/books/book?id='+bookId);
              console.log(response.data);
                setBook(response.data);
            } catch (error) {
              console.log('Error:', error);
              setError(error.message);
            }
          };
      
          fetchBookDetails(id);

    }, [id]);

    return (
        <div className="product-page p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <h2 className="text-xl text-gray-700">by {book.author}</h2>
            <img className="w-full h-auto rounded" src={product.imageUrl} alt={product.title} />
            <p className="text-gray-600">{book.description}</p>
            <p className="text-lg font-semibold">Price: {product.book_price}</p>
        <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add to Cart</button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">Add to Wishlist</button>
        </div>
        </div>
    );
};

export default ProductPage;