"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../components/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [userData, setUserData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          toast.error("User data not found.");
        }
      }
    };

    fetchUserData();
    // Check current theme preference
    const theme = localStorage.getItem("theme") || "light";
    setIsDarkTheme(theme === "dark");
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);

    const user = auth.currentUser;
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        toast.success("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error("Error changing password!");
        console.error("Error changing password:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleThemeChange = (e) => {
    setIsDarkTheme(e.target.checked);
    localStorage.setItem("theme", e.target.checked ? "dark" : "light");
    document.documentElement.classList.toggle("dark", e.target.checked);
  };

  const handleEmailVerification = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.sendEmailVerification();
        toast.success("Verification email sent!");
      } catch (error) {
        toast.error("Error sending verification email!");
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8`}>
      <Toaster position="top-center" />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Account Settings
        </h2>

        {/* Change Password Section */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Change Password
          </h3>

          {/* Current Password */}
          <div>
            <label className="block text-md font-semibold text-gray-800 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-md font-semibold text-gray-800 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-md font-semibold text-gray-800 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-400 transition-all disabled:bg-gray-400"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>

        {/* Email Verification */}
        {!auth.currentUser?.emailVerified && (
          <div className="mt-6 text-center">
            <button
              onClick={handleEmailVerification}
              className="text-blue-600 hover:underline font-semibold"
            >
              Verify Email
            </button>
          </div>
        )}

        {/* Dark Mode Toggle */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-md font-semibold text-gray-800 dark:text-gray-300">Dark Mode</span>
          <input
            type="checkbox"
            checked={isDarkTheme}
            onChange={handleThemeChange}
            className="h-6 w-11 rounded-full border-2 border-gray-300 focus:outline-none transition-all duration-300 transform"
          />
        </div>
      </div>
    </div>
  );
}
