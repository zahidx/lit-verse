'use client'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (err) {
      setError('Error fetching books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setBooks([]);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#f0f0f0] dark:from-[#0E1628] dark:to-[#2C0039] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div
        className="flex items-center justify-center bg-cover bg-center h-screen relative bg-fixed"
        style={{
          backgroundImage: 'url(https://via.placeholder.com/1920x1080?text=Dynamic+Book+Background)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative text-center z-10 p-6">
          <h1 className="text-5xl font-extrabold text-[#E5970F] mb-4">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-xl text-gray-900 dark:text-gray-200 mb-6">
            Search a wide variety of books, authors, and genres.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="p-3 w-3/4 md:w-1/2 bg-[#1E1E2F] dark:bg-[#1E1E2F] text-white rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-[#E5970F] transition duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-[#E5970F] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#D47800] transition duration-300 ml-4 transform hover:scale-105"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="px-6 py-8">
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book.id} className="relative rounded-lg shadow-lg overflow-hidden">
                  {/* Book Cover (Full Card) */}
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
                    alt={book.volumeInfo.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Book Title & Author (Small and Inside the Card) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-white text-xs">
                    <h2 className="truncate">{book.volumeInfo.title}</h2>
                    <p className="truncate">{book.volumeInfo.authors?.join(', ')}</p>
                    <Link href={`/book/${book.id}`}>
                      <span className="text-[#E5970F] hover:underline">View Details</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
