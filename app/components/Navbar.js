"use client";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu, FiX, FiUser, FiBell, FiSun, FiMoon } from "react-icons/fi";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "true");
    }
  }, []);

  // Toggle dark mode and save preference to localStorage
  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileDropdownClick = () => {
    if (menuOpen) {
      setMenuOpen(false); // Close the mobile menu if it's open
    }
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close profile dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !event.target.closest(".profile-icon")
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close category dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".category-button")
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Apply the dark mode class to the body
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav className="bg-gradient-to-r from-[#0E1628] to-[#380643] text-white p-4 shadow-lg fixed w-full z-50 transition-colors duration-300 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#222222]">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with Icon before the Text */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white transition-colors duration-300 hover:text-yellow-400">
          <FiUser className="text-2xl" />
          <span>LitVerse ❤️</span>
        </Link>

        {/* Search Bar with Auto-Suggest */}
        <div className="hidden md:flex items-center bg-gray-800 p-2 rounded-lg relative w-1/3 dark:bg-gray-700 transition-colors duration-300">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-white px-2 w-full"
          />
          <FiSearch className="text-gray-400 cursor-pointer dark:text-gray-200" />

          {/* Auto-suggest dropdown */}
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-gray-900 text-white p-2 rounded-lg mt-1 dark:bg-gray-800 transition-colors duration-300">
              <p className="text-sm text-gray-400 dark:text-gray-300">🔍 Searching for "{searchQuery}"...</p>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={handleDropdownClick}
              className="category-button text-white hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-300"
            >
              Categories
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 bg-gray-900 text-white mt-2 p-3 rounded-lg w-56 dark:bg-gray-800 transition-colors duration-300 shadow-lg z-10"
              >
                <Link href="/fiction" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-2">📖 Fiction</Link>
                <Link href="/mystery" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-2">🔍 Mystery</Link>
                <Link href="/sci-fi" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-2">🚀 Sci-Fi</Link>
              </div>
            )}
          </div>

          <Link href="/trending" className="hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-300">🔥 Trending</Link>
          <Link href="/library" className="hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-300">📚 My Library</Link>
        </div>

        {/* User Profile, Notifications & Theme Toggle */}
        <div className="flex items-center space-x-4">
          {/* Notifications Icon */}
          <button className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300">
  <FiBell />
  <span className="absolute top-[-10px] right-[-4px] bg-red-500 text-xs text-white px-1 py-0.9 rounded-full">
    5
  </span>
</button>


          {/* Dark Mode Toggle */}
          <button
            onClick={handleDarkModeToggle}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
          >
            {isDarkMode ? (
              <FiSun className="text-yellow-500" />
            ) : (
              <FiMoon className="text-blue-500" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative profile-icon">
            <button
              onClick={handleProfileDropdownClick}
              className="text-2xl cursor-pointer hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-300"
            >
              <FiUser />
            </button>
            {isProfileDropdownOpen && (
              <div
                ref={profileDropdownRef}
                className="absolute right-0 bg-gray-900 text-white mt-2 p-3 rounded-lg w-56 dark:bg-gray-800 transition-colors duration-300 shadow-lg z-10"
              >
                <Link
                  href="/profile"
                  className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-4"
                >
                  👤 My Profile
                </Link>
                <Link
                  href="/saved-books"
                  className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-4"
                >
                  📚 Saved Books
                </Link>
                <Link
                  href="/settings"
                  className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-4"
                >
                  ⚙️ Settings
                </Link>
                <button
                  className="block w-full text-left hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-4"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 text-white text-center p-4 space-y-3 dark:bg-gray-800 transition-colors duration-300">
          <div className="relative">
            {/* Categories Dropdown in Mobile */}
            <button
              onClick={handleDropdownClick}
              className="category-button text-white hover:text-gray-300 dark:hover:text-gray-400 transition-colors duration-300"
            >
              Categories
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 bg-gray-900 text-white mt-2 p-3 rounded-lg w-56 dark:bg-gray-800 transition-colors duration-300 shadow-lg z-10"
              >
                <Link href="/fiction" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-2">📖 Fiction</Link>
                <Link href="/mystery" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-2">🔍 Mystery</Link>
                <Link href="/sci-fi" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300 py-1 px-2">🚀 Sci-Fi</Link>
              </div>
            )}
          </div>

          <Link href="/trending" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300">🔥 Trending</Link>
          <Link href="/library" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300">📚 My Library</Link>
        </div>
      )}
    </nav>
  );
}
