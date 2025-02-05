// components/Hero.js
import React from "react";
import { motion } from "framer-motion"; // Ensure you have framer-motion installed for animations.

const Hero = () => {
  return (
    <div className=" w-full relative bg-gradient-to-r from-indigo-600 to-purple-700 dark:bg-gradient-to-r dark:from-[#0E1628] dark:to-[#380643] text-white text-center py-20 ">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-[#0E1628] dark:to-[#380643] opacity-50"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
      />

      {/* Main Heading with Smooth Animation */}
      <motion.h1
        className="pt-10 text-4xl md:text-5xl font-extrabold mb-6 animate__animated animate__fadeIn"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        Discover Your Next Favorite Book
      </motion.h1>

      {/* Subtitle with Fade-In Animation */}
      <motion.p
        className="text-lg md:text-xl mb-6 opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Explore a wide range of books from various genres, authors, and more.
      </motion.p>

      {/* Call to Action Button with Hover Effects */}
      <motion.a
        href="#search"
        className="px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-semibold shadow-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110"
        aria-label="Start Searching"
        whileHover={{
          scale: 1.05,
          rotate: -5,
          transition: { type: "spring", stiffness: 200 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        Start Searching
      </motion.a>

      {/* Subtle Decorative Circle */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-white opacity-10 rounded-full blur-xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
      />

      {/* Background Animation for Dark Mode */}
      <motion.div
        className="absolute inset-0 bg-black opacity-10 rounded-full blur-xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
      />
    </div>
  );
};

export default Hero;
