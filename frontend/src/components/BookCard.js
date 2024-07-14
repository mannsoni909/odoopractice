import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ id, title, description, coverImage, author, rating, genre, handleBorrow }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/readmore/${id}`}>
        <img className="w-full h-48 object-cover rounded-t-lg" src={coverImage} alt={title} />
      </Link>
      <div className="p-5">
        <Link to={`/readmore/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </Link>
        <p className="mb-1 text-gray-700 dark:text-gray-400">Author: {author}</p>
        <p className="mb-1 text-gray-700 dark:text-gray-400">Rating: {rating}</p>
        <p className="mb-3 text-gray-700 dark:text-gray-400">Genre: {genre}</p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description?.substring(0, 100)}...
        </p>
        <div className="flex justify-between">
          <Link
            to={`/readmore/${id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-blue-700 dark:text-blue-300">
            Read More
          </Link>
          <button
            onClick={handleBorrow}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800">
            Borrow
          </button>
        </div>
      </div>
    </div>
  )
};

export default BookCard;