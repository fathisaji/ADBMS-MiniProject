import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation(); // Wouter navigation
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { username, password });

      // Save JWT token and role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Set user in Zustand store
      setUser({
        userId: res.data.userId, // make sure backend returns this
        role: res.data.role,
        fullName: res.data.fullName, // optional
      });

      // Redirect based on role
      if (res.data.role === "CUSTOMER") {
        setLocation("/customer-dashboard");
      } else {
        setLocation("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid credentials. Please try again.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4 text-center font-semibold">Login</h2>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Login
        </button>
        <p className="mt-2 text-center text-sm">
          Don't have an account? <a href="/signup" className="text-blue-600">Sign up</a>
        </p>
      </form>
    </div>
  );
}