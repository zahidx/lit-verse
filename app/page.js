"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Hero from "./components/Hero"; // Import Hero section
import { debounce } from "lodash"; // For debouncing the search input

const Home = () => {
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
    <div className="container mx-auto bg-gray-900 text-white">
      {/* Hero Section */}
      <Hero />

      {/* Search Form */}
      <div className="mt-10 flex items-center justify-center space-x-4" id="search">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white w-3/4"
          />
        </div>

        {/* Filter Options */}
        <div className="flex space-x-4">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="nonfiction">Non-Fiction</option>
            <option value="fantasy">Fantasy</option>
            {/* Add more genres */}
          </select>

          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
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
            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            {/* Add more languages */}
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          Clear Filters
        </button>
      </div>

      {/* Suggested Searches */}
      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute right-0 top-16 bg-gray-800 p-4 rounded-lg w-1/4 z-10"
        >
          <h4 className="text-lg">Suggested searches:</h4>
          <ul className="mt-2">
            {suggestions.map((book) => (
              <li
                key={book.id}
                className="cursor-pointer text-indigo-500 hover:text-indigo-300"
                onClick={() => setSearchTerm(book.volumeInfo.title)} // Set the search term to clicked suggestion
              >
                {book.volumeInfo.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {books.length === 0 && !loading && <p>No books found.</p>}
        {books.map((book) => (
          <div
            key={book.id}
            className="border border-gray-700 p-4 rounded-lg shadow-lg hover:shadow-xl"
          >
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="w-32 h-48 object-cover rounded-lg"
            />
            <h3 className="font-semibold text-lg mt-2">{book.volumeInfo.title}</h3>
            <p className="text-sm text-gray-400">by {book.volumeInfo.authors?.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center mt-8">
          <div className="spinner text-white">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Home;
