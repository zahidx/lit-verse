"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false); // Track if a search has been performed

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true); // Mark that a search has been done

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (err) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#f0f0f0] dark:from-[#0E1628] dark:to-[#2C0039] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div
        className="flex items-center justify-center bg-cover bg-center h-screen relative"
        style={{
          backgroundImage:
            "url(https://via.placeholder.com/1920x1080?text=Dynamic+Book+Background)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center z-10 p-6">
          <h1 className="text-6xl font-extrabold text-[#E5970F] dark:text-[#E5970F] mb-6">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-xl text-gray-900 dark:text-gray-200 mb-8">
            Dive into a world of books, authors, and knowledge. Search for titles, explore new genres, and find your next read.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center mb-10 space-x-4">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="p-4 w-2/3 md:w-1/2 bg-[#1E1E2F] dark:bg-[#1E1E2F] text-white dark:text-white rounded-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-[#E5970F] focus:ring-opacity-50 transition duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-[#E5970F] text-black dark:text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#D47800] transition duration-300"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Show results only if a search has been done */}
      {searched && (
        <div className="px-8 py-6">
          {loading ? (
            <p className="text-center text-white text-lg">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg">{error}</p>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-[#1E1E2F] p-6 rounded-3xl shadow-2xl hover:scale-105 transform transition duration-300 ease-out"
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={
                        book.volumeInfo.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/128x200?text=No+Image"
                      }
                      alt={book.volumeInfo.title}
                      className="w-48 h-72 object-cover rounded-lg mb-6 shadow-lg"
                    />
                    <h2 className="text-2xl font-bold text-[#E5970F] mb-3">
                      {book.volumeInfo.title}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {book.volumeInfo.authors?.join(", ")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {book.volumeInfo.publishedDate}
                    </p>
                    <Link href={`/book/${book.id}`}>
                      <span className="text-[#E5970F] hover:underline mt-2 inline-block">
                        View Details
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white text-lg">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
