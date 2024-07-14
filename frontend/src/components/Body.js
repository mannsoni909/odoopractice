import React, { useState, useEffect, useContext } from 'react';
    import axios from 'axios';
    import BookCard from './BookCard';
    import { AuthContext } from '../contexts/AuthContext';

    const Body = () => {
    const [newBookList, setNewBookList] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [search, setSearch] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterGenre, setFilterGenre] = useState('');
    const [filterRating, setFilterRating] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');
    const { loading, setLoading, ClipLoader } = useContext(AuthContext);
    const [message,setMessage]=useState('')

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/inventory');
            setBookList(response.data); // Assuming 'data' contains the array of books from the response
            setNewBookList(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
        };
        fetchData();
    }, []);

    if (bookList.length===0){
        setLoading(true)
    } else{
        setLoading(false)
    }

    useEffect(() => {
        if (newBookList.length === 0) {
          setMessage('No Book found for given Filter');
        } else {
          setMessage('');
        }
      }, [newBookList]);


    const handleSearch = () => {
        var filteredBooks = bookList.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase())
        );
        setNewBookList(filteredBooks);
    };

    const handleFilterOpen = () => {
        setFilterOpen(true);
    };

    const handleFilterClose = () => {
        setFilterOpen(false);
    };

    const handleFilterApply = () => {
        let filteredBooks = bookList;

        if (filterGenre) {
        filteredBooks = filteredBooks.filter(book =>
            book.genre.toLowerCase().includes(filterGenre.toLowerCase())
        );
        }

        if (filterRating){
            filteredBooks = filteredBooks.filter(book =>
                book.rating>=filterRating)
        }

        if (filterAuthor) {
        filteredBooks = filteredBooks.filter(book =>
            book.authors.toLowerCase().includes(filterAuthor.toLowerCase())
        );
        }

        setNewBookList(filteredBooks);
        setFilterOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        setFilterOpen(false);
        }
    };

    return (
        <div className="container mx-auto p-4 relative">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <ClipLoader size={150} color="#4A90E2" loading={loading} />
            </div>
        )}
        {filterOpen && (
            <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            >
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-2">Filter Options</h2>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <input
                    type="text"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                    placeholder="Enter genre..."
                />
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Rating(1-5)</label>
                <input
                    type="number"
                    max={5}
                    min={0}
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                    placeholder="Enter genre..."
                />
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                    type="text"
                    value={filterAuthor}
                    onChange={(e) => setFilterAuthor(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md w-full"
                    placeholder="Enter author..."
                />
                </div>
                <div className="flex justify-end">
                <button
                    onClick={handleFilterClose}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={handleFilterApply}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Apply
                </button>
                </div>
            </div>
            </div>
        )}
        
        <div className="flex mb-4">
            <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-400 p-2 rounded-lg w-full"
            placeholder="Search by title"
            />
            <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded-lg ml-2 w-16"
            >
            Search
            </button>
            <button
            onClick={handleFilterOpen}
            className="bg-gray-500 text-white p-2 rounded-lg ml-2"
            >
            Filter
            </button>
        </div>
        {message && (
    <h1 className="text-4xl font-bold text-center mt-20">{message}</h1>
    )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newBookList.map((book) => (
            <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                description={book.description}
                coverImage={book.thumbnail_url}
                author={book.authors}
                genre={(book.genre).split(' ').join(',')}
                handleBorrow={() => alert(`Borrowing ${book.title}`)}
            />
            ))}
        </div>
        </div>
    );
    };

    export default Body