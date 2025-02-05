"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Hero from "./components/Hero"; // Import Hero section
import { debounce } from "lodash"; // For debouncing the search 
import Genre from "./components/Ctgen"; // Import genre component
import TrendingBooks from "./components/TrendingBooks";
import RecommendedBooks from "./components/RecommendedBooks";



const Home = () => {
  const handleBookClick = (book) => {
    console.log("Book clicked:", book);  // Log book details, or implement your logic here
    // You can also redirect to a detailed page or open a modal
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [authorList, setAuthorList] = useState([]);

  // Refs for handling clicks outside the suggestions div
  const suggestionsRef = useRef(null);

  // Fetch books from the Google Books API
  const fetchBooks = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    let filterQuery = `${query}`;
    if (genre) filterQuery += `+subject:${genre}`;
    if (author) filterQuery += `+inauthor:${author}`;
    if (language) filterQuery += `+lang:${language}`;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${filterQuery}&maxResults=10&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      if (response.data.items) {
        setBooks(response.data.items);
      } else {
        setBooks([]);
      }
    } catch (err) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(searchTerm);
    }, 500);
    return () => clearTimeout(timer); // Clear previous timer
  }, [searchTerm, genre, author, language]);

  // Debounced search suggestions
  const fetchSuggestions = async (term) => {
    if (term.trim()) {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=5&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
        );
        setSuggestions(response.data.items || []);
      } catch (err) {
        setError("Error fetching suggestions.");
      }
    } else {
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  // Handle input changes
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedFetchSuggestions(term);
  };

  // Handle author dropdown
  useEffect(() => {
    if (genre) {
      fetchAuthorsForGenre(genre);
    }
  }, [genre]);

  const fetchAuthorsForGenre = async (genre) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=5&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      );
      const authors = response.data.items?.map((book) => book.volumeInfo.authors).flat() || [];
      setAuthorList([...new Set(authors)]); // Remove duplicates
    } catch (err) {
      setError("Error fetching authors.");
    }
  };

  // Clear filters and search
  const clearFilters = () => {
    setSearchTerm("");
    setGenre("");
    setAuthor("");
    setLanguage("");
    setBooks([]);
    setSuggestions([]);
  };

  // Handle click outside the suggestions div
  const handleClickOutside = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  // Attach event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className=" pl-12 pr-12  container mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <Hero />
  
      {/* Search Form */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-4 md:space-y-0 w-full px-4" id="search">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full md:w-72"
          />
        </div>
  
        {/* Filter Options */}
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 w-full md:w-auto">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-full md:w-auto"
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="nonfiction">Non-Fiction</option>
            <option value="fantasy">Fantasy</option>
          </select>
  
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-full md:w-auto"
          >
            <option value="">All Authors</option>
            {authorList.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>
  
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg w-full md:w-auto"
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
  
        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          Clear Filters
        </button>
      </div>
  
      {/* Suggested Searches */}
      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute right-0 top-16 bg-gray-800 dark:bg-gray-700 p-4 rounded-lg w-full md:w-1/4 z-10"
        >
          <h4 className="text-lg">Suggested searches:</h4>
          <ul className="mt-2">
            {suggestions.map((book) => (
              <li
                key={book.id}
                className="cursor-pointer text-indigo-500 hover:text-indigo-300"
                onClick={() => setSearchTerm(book.volumeInfo.title)}
              >
                {book.volumeInfo.title}
              </li>
            ))}
          </ul>
        </div>
      )}
  
      {/* Display Books */}
      <div className="flex justify-center mt-10">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4">
            {books.length === 0 ? (
              <p className="col-span-full text-center text-xl text-gray-500 dark:text-gray-400">
                
              </p>
            ) : (
              books.map((book, index) => (
                <div
                  key={book.id}
                  className="relative border border-gray-700 dark:border-gray-600 p-4 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out
                            hover:scale-105 hover:shadow-2xl hover:translate-y-2 hover:pt-4"
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
      </div>
      <Genre />
      <TrendingBooks/>
      <RecommendedBooks />
      
  
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

export default Home;
