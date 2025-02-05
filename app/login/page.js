"use client";

import { useState, useEffect } from "react";
import { auth, googleProvider, db } from "../components/firebase";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showEmailSuggestion, setShowEmailSuggestion] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Auto-fill email if "Remember Me" was checked
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! 🎉");

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        profilePic: user.photoURL,
        createdAt: new Date(),
      }, { merge: true });

      toast.success("Logged in with Google! 🎉");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      toast.error("Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error("Enter your email to reset password!");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Error sending reset email!");
    }
  };

  // Handle email input change and show suggestion
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Show suggestion if the email is not empty and doesn't contain '@gmail.com'
    if (value && !value.includes('@gmail.com')) {
      setShowEmailSuggestion(true);
    } else {
      setShowEmailSuggestion(false);
    }
  };

  // Handle suggestion click to complete email
  const handleEmailSuggestionClick = () => {
    setEmail(email + "@gmail.com");
    setShowEmailSuggestion(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-center" />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900 dark:text-gray-100">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="relative">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {showEmailSuggestion && (
              <span
                className="absolute right-3 top-10 text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={handleEmailSuggestionClick}
              >
                @gmail.com
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mt-3">
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              Remember Me
            </label>
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-5 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 transition-all disabled:bg-gray-400 flex justify-center items-center"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : "Login"}
          </button>
        </form>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2 mt-3 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-400 transition-all disabled:bg-gray-400 flex justify-center items-center"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : "Login with Google"}
        </button>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
