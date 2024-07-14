import React from 'react';

const MyBooks = ({ books }) => {
    return (
        <div className="p-6 mt-16 max-w-md w-full bg-orange-300 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800">My Books</h2>
            <div className="space-y-4">
                {books.length > 0 ? (
                    books.map((book, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="w-16 h-20 object-cover border-2 border-orange-700"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                                <p className="text-sm text-gray-600">{book.author}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No books available.</p>
                )}
            </div>
        </div>
    );
};

export default MyBooks;
