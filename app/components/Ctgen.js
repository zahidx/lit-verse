import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash"; // For debounced search input

const GenreCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Fiction"); // Default category set to "Fiction"
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [bookType, setBookType] = useState("");
  const [sortOption, setSortOption] = useState("relevance");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoriesAndGenres();
  }, []);

  useEffect(() => {
    if (selectedCategory || selectedGenre || selectedLanguage || bookType) {
      fetchBooks();
    }
  }, [selectedCategory, selectedGenre, selectedLanguage, bookType, sortOption]);

  const fetchCategoriesAndGenres = async () => {
    try {
      // Static data for categories and genres
      const categoryData = ["Fiction", "Non-fiction", "Science", "Fantasy"];
      const genreData = ["Adventure", "Romance", "Mystery", "Thriller"];
      setCategories(categoryData);
      setGenres(genreData);
    } catch (err) {
      setError("Error fetching categories and genres.");
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const genreQuery = selectedGenre ? `+subject:${selectedGenre}` : "";
      const categoryQuery = selectedCategory ? `+category:${selectedCategory}` : "";
      const languageQuery = selectedLanguage ? `+language:${selectedLanguage}` : "";
      const bookTypeQuery = bookType ? `+filter:${bookType}` : "";
      const sortQuery = `&orderBy=${sortOption}`;

      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${genreQuery}${categoryQuery}${languageQuery}${bookTypeQuery}${sortQuery}&maxResults=20&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );

      setBooks(response.data.items || []);
    } catch (err) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = debounce((value) => {
    setBooks([]);
    fetchBooks(value);
  }, 500);

  return (
    <div className="pl-12 pr-12 container mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">Browse Books</h2>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {/* Category Filter */}
        <select
          className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Genre Filter */}
        <select
          className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Language Filter */}
        <select
          className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>

        {/* Book Type Filter */}
        <select
          className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
          value={bookType}
          onChange={(e) => setBookType(e.target.value)}
        >
          <option value="">Select Book Type</option>
          <option value="ebook">eBook</option>
          <option value="audiobook">Audiobook</option>
        </select>

        {/* Sort Option */}
        <select
          className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="relevance">Sort by Relevance</option>
          <option value="newest">Sort by Newest</option>
          <option value="best">Sort by Best</option>
        </select>
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
              No books found based on the selected filters.
            </p>
          ) : (
            books.map((book, index) => (
              <div
                key={book.id}
                className="relative border border-gray-700 dark:border-gray-600 p-4 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:pt-4"
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

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default GenreCategoryPage;
