import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';


const ReadMore = () => {
  var { id } = useParams();
  id=Number(id)
//   const [bookList, setBookList] = useState([]);
  const [book, setBook] = useState('');
  const { loading, setLoading, ClipLoader } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/inventory');
        // setBookList(response.data); // Assuming 'data' contains the array of books from the response
        console.log(response.data)
        const foundBook = response.data.find(res => res.id === id);
        setBook(foundBook);
        // console.log(bookList)
        console.log(foundBook)
    } catch (error) {
        console.error('Error fetching books:', error);
    }
    };
    fetchData();
    // eslint-disable-next-line
}, []);


  if (!book) {
    setLoading(true)
  }
  else{
    setLoading(false)
  }

  return (
    <div className="max-w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto my-4 p-5">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <ClipLoader size={150} color="#4A90E2" loading={loading} />
            </div>
        )}
        <img className="w-full h-64 object-cover rounded-lg" src={book.thumbnail_url} alt={book.title} />
      <div className="p-5">
          <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {book.title}
          </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {book.description}
        </p>
        <Link to="/">
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReadMore;