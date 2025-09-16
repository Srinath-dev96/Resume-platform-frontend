"use client";

import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await api.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>No user data found</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <p className="text-gray-700 mb-2">Email: {user.email}</p>
      <p className="text-gray-500 text-sm">User ID: {user._id}</p>
    </div>
  );
}
