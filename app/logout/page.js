"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../components/firebase";
import toast, { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

export default function Logout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await signOut(auth);
        toast.success("You have been logged out successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        toast.error("Error logging out!");
        console.error("Error logging out:", error);
      }
    };

    logoutUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-50" >Signing Out!</p>
        <Loader size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-center" />
    </div>
  );
}
