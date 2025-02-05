import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const TrendingBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchTrendingBooks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval);
  }, [books]);

  const fetchTrendingBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=orderBy=rating&maxResults=20&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (err) {
      setError("Error fetching trending books.");
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="pl-12 pr-12 container mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative">
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">Trending Books</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-xl text-red-500">{error}</p>
      ) : (
        <div className="relative group">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={scrollLeft}
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transform transition-all duration-300 ease-in-out hover:scale-110"
            >
              <FaArrowLeft size={24} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 py-4 px-2 scrollbar-hide overflow-hidden"
            style={{
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
            }}
          >
            {books.length === 0 ? (
              <p className="text-center text-xl text-gray-500 dark:text-gray-400">No trending books found.</p>
            ) : (
              books.concat(books).map((book, index) => (
                <div
                  key={index}
                  className="flex-none w-48 border border-gray-700 dark:border-gray-600 p-4 rounded-xl shadow-lg transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:translate-y-2"
                >
                  <div className="flex justify-center items-center h-60 overflow-hidden rounded-lg">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail}
                      alt={book.volumeInfo.title}
                      className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-110"
                    />
                  </div>
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

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={scrollRight}
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transform transition-all duration-300 ease-in-out hover:scale-110"
            >
              <FaArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingBooks;
