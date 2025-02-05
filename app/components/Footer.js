"use client";

import React, { useState, useEffect } from "react";

const Footer = () => {
  const [theme, setTheme] = useState("dark");

  // Detect system theme preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  return (
    <footer
      className={`relative py-16 ${theme === "dark" ? "bg-gradient-to-r from-[#2C3E50] to-[#34495E]" : "bg-gradient-to-r from-[#ecf0f1] to-[#bdc3c7]"} text-white`}
    >
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-fixed opacity-40 z-0" style={{ backgroundImage: 'url("/images/footer-background.jpg")' }}></div>
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand and Description Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-4xl font-bold text-white mb-4">LitVerse</h2>
            <p className="text-sm text-gray-300 mb-4 max-w-xs sm:max-w-md">
              Your go-to place for discovering the latest trending books, personalized recommendations, and more.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-white transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="https://facebook.com"
                className="text-gray-300 hover:text-white transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-300 hover:text-white transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

         {/* Newsletter Section */}
<div className="flex flex-col items-center sm:items-start">
  <h3 className="text-lg font-semibold text-white mb-4">Subscribe to Our Newsletter</h3>
  <p className="text-sm text-gray-300 mb-4 max-w-xs sm:max-w-md">
    Get the latest updates on new books, recommendations, and special offers directly in your inbox.
  </p>
  <form className="flex items-center space-x-4">
    <input
      type="email"
      placeholder="Enter your email"
      className="px-4 py-3 w-48 sm:w-64 border border-gray-600 bg-transparent rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-300"
    />
    <button
      type="submit"
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
    >
      Subscribe
    </button>
  </form>
</div>

        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-600 pt-8 mt-8 text-center">
          <p className="text-gray-300 text-sm mb-2">
            &copy; {new Date().getFullYear()} LitVerse. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs">
            Designed with 💙 by{" "}
            <a
              href="https://yourportfolio.com"
              className="text-blue-400 hover:text-white transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              zahid
            </a>
          </p>
        </div>
      </div>

      {/* Scroll-to-Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        aria-label="Scroll to top"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </footer>
  );
};

export default Footer;
