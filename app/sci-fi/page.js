"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Import FaSpinner
import { Loader } from "react-feather"; // Assuming you're using a loader component from react-feather

const SciFiBooks = () => {
  const [sciFiBooks, setSciFiBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // State for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  // Fetch sci-fi books from the Google Books API with pagination
  const fetchSciFiBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=sci-fi&orderBy=newest&maxResults=12&startIndex=${(page - 1) * 12}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );

      if (response.data.items) {
        setSciFiBooks(response.data.items);
        setTotalPages(Math.ceil(response.data.totalItems / 12)); // Set total pages based on totalItems
      } else {
        setSciFiBooks([]);
      }
    } catch (err) {
      setError("Error fetching Sci-Fi books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSciFiBooks();
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
    <div className="pt-[100px] px-4 dark:bg-[#0e1628] dark:text-white transition-all pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sci-Fi Books</h2>

        {/* Previous and Next buttons at the top right */}
        <div className="flex">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-4 disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Loader size={48} className="animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">{error}</p>
      ) : (
        <div>
          {/* Display Books */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
            {sciFiBooks.length === 0 ? (
              <p className="col-span-full text-center text-xl text-gray-500 dark:text-gray-400">
                No sci-fi books found.
              </p>
            ) : (
              sciFiBooks.map((book, index) => (
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

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8">
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
              className="px-4 py-2 bg-gray-600 text-white rounded-lg ml-4 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SciFiBooks;
