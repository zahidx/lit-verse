"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Cute spinning icon

const MysteryPage = () => {
  const [mysteryBooks, setMysteryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // Total pages state for pagination

  // Fetch mystery books from the Google Books API
  const fetchMysteryBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:mystery&orderBy=newest&maxResults=12&startIndex=${(page - 1) * 12}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      if (response.data.items) {
        setMysteryBooks(response.data.items);
        setTotalPages(Math.ceil(response.data.totalItems / 12)); // Set total pages based on totalItems
      } else {
        setMysteryBooks([]);
      }
    } catch (err) {
      setError("Error fetching mystery books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMysteryBooks();
  }, [page]);

  // Handle previous page click
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Handle next page click
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="pt-[100px] px-4 dark:bg-[#0e1628] dark:text-white transition-all pb-20 pl-20 pr-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mystery Books</h2>

        {/* Pagination Controls */}
        <div className="flex items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-4 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-xl text-gray-900 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg ml-4 disabled:bg-gray-400 "
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">{error}</p>
      ) : (
        <div>
          {/* Display Mystery Books */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
            {mysteryBooks.length === 0 ? (
              <p className="col-span-full text-center text-xl text-gray-500 dark:text-gray-400">
                No mystery books found.
              </p>
            ) : (
              mysteryBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="relative border border-gray-700 dark:border-gray-600 p-4 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out
                            hover:scale-105 hover:shadow-2xl hover:translate-y-2"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                  {/* Image Container */}
                  <div className="flex justify-center items-center h-60 overflow-hidden rounded-lg">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail}
                      alt={book.volumeInfo.title}
                      className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-white truncate">
                      {book.volumeInfo.title}
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-gray-400">
                      {book.volumeInfo.authors?.join(", ")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MysteryPage;
