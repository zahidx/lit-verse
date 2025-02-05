import React, { useState, useEffect } from "react";
import axios from "axios";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("Fiction"); // Default genre is Fiction

  useEffect(() => {
    fetchRecommendedBooks();
  }, [selectedGenre]);

  const fetchRecommendedBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      // You can adjust the genre query here based on the user's preference or other criteria
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedGenre}&maxResults=20&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (err) {
      setError("Error fetching recommended books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-12 pr-12 container mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Flex container for header and genre filter */}
      <div className="flex justify-between items-center mt-10 mb-6 pl-4">
        <h2 className="text-3xl font-bold text-center">Recommended Books</h2>

        {/* Genre Filter beside header */}
        <div>
          <select
            className="border p-2 mr-4 rounded-md dark:bg-gray-800 dark:text-white"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Science">Science</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </div>
      </div>

      {/* Loading or Error */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-xl text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4">
          {books.length === 0 ? (
            <p className="col-span-full text-center text-xl text-gray-500 dark:text-gray-400">
              No recommended books found.
            </p>
          ) : (
            books.map((book, index) => (
              <div
                key={book.id}
                className="relative border border-gray-700 dark:border-gray-600 p-4 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-out hover:translate-y-[-10px] hover:shadow-2xl"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Image Container */}
                <div className="flex justify-center items-center h-60 overflow-hidden rounded-lg transition-transform duration-300 ease-out hover:translate-y-[-10px]">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
                    alt={book.volumeInfo.title}
                    className="object-cover w-full h-full transition-transform duration-500 transform hover:scale-110"
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
      )}
    </div>
  );
};

export default RecommendedBooks;
