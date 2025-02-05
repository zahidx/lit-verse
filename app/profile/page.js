"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../components/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push("/login");
    } else {
      fetchUserData(currentUser.uid);
    }
  }, [router]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setNewName(userData.name || "");
        setNewEmail(userData.email || "");
        setNewPhoneNumber(userData.phoneNumber || "");
      } else {
        toast.error("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!newName || !newEmail || !newPhoneNumber) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    try {
      // Update user data in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name: newName,
        email: newEmail,
        phoneNumber: newPhoneNumber,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("You have logged out.");
      router.push("/login");
    } catch (error) {
      toast.error("Error signing out!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-center" />
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          Your Profile
        </h2>

        <div className="flex justify-center mb-6">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-medium">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-3 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-medium">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-3 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg font-medium">Phone Number</label>
          <input
            type="text"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            className="w-full p-3 mt-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Update Profile Button */}
        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 transition-all disabled:bg-gray-400 flex justify-center items-center"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : "Update Profile"}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 mt-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-400 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
