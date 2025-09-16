"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/register", { name, email, password });

      // Token store
      localStorage.setItem("token", res.data.token);

      // Redirect
      router.push("/profile");
    } catch (err: any) {
      console.error("❌ Registration failed:", err.response?.data || err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-md w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-3 rounded-lg" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-3 rounded-lg" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-3 rounded-lg" required />
        <button type="submit" className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">Register</button>
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
