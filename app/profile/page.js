"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../components/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
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
        console.log("User data fetched:", userData); // Debugging line
        setUser(userData);
        setNewName(userData.name || ""); // Ensure this is the correct field name for full name
        setNewEmail(userData.email || "");
        setProfilePicUrl(userData.profilePic || "");
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
    if (!newName || !newEmail) {
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
      });

      // If profile picture is selected, upload it
      if (newProfilePic) {
        const storage = getStorage();
        const profilePicRef = ref(storage, `profile-pics/${auth.currentUser.uid}`);
        await uploadBytes(profilePicRef, newProfilePic);
        const profilePicURL = await getDownloadURL(profilePicRef);
        await updateDoc(userRef, {
          profilePic: profilePicURL,
        });
        setProfilePicUrl(profilePicURL); // Update local state
      }

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

  const handleProfilePicChange = (e) => {
    setNewProfilePic(e.target.files[0]);
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-900 dark:text-gray-100">Your Profile</h2>

        <div className="flex justify-center mb-5">
          <img
            src={profilePicUrl || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Profile Picture Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="w-full p-2 text-sm text-gray-600 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-md"
          />
        </div>

        {/* Name Field */}
        <div className="relative mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email Field */}
        <div className="relative mb-4">
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="w-full py-2 mt-5 bg-blue-500 text-white font-medium rounded-md shadow-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 transition-all disabled:bg-gray-400 flex justify-center items-center"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : "Update Profile"}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full py-2 mt-3 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 focus:ring-4 focus:ring-red-400 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
