import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          {/* Logo Section */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold">LitVerse</h2>
            <p className="text-sm text-gray-400 mt-2">Your Book Discovery Hub</p>
          </div>

          {/* Links Section */}
          <div className="flex gap-8 mb-6 md:mb-0">
            <div>
              <h3 className="font-semibold text-lg">Quick Links</h3>
              <ul className="mt-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-gray-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-gray-200">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-gray-200">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Social</h3>
              <ul className="mt-2">
                <li>
                  <a
                    href="https://twitter.com"
                    className="text-gray-400 hover:text-gray-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    className="text-gray-400 hover:text-gray-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    className="text-gray-400 hover:text-gray-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-lg">Newsletter</h3>
            <p className="text-gray-400 mt-2">Get the latest book recommendations and updates.</p>
            <form className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-64 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} LitVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
