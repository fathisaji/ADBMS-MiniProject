import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nicPassportNo, setNicPassportNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // default role

  const [, setLocation] = useLocation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signupData = {
        username,
        password,
        role,
        fullName,
        nicPassportNo,
        phoneNo,
        email,
        address,
        licenseNo,
      };

      await axios.post("http://localhost:8080/api/auth/signup", signupData);

      alert("Signup successful! Please log in.");
      setLocation("/login");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data || "Signup failed. Try again.");
    }
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow w-96">
          <h2 className="text-xl mb-4 text-center font-semibold">Sign Up</h2>

          {/* Customer Details */}
          <input
              className="border p-2 w-full mb-3"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
          />
          <input
              className="border p-2 w-full mb-3"
              placeholder="NIC / Passport No"
              value={nicPassportNo}
              onChange={(e) => setNicPassportNo(e.target.value)}
          />
          <input
              className="border p-2 w-full mb-3"
              placeholder="Phone No"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
          />
          <input
              className="border p-2 w-full mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <input
              className="border p-2 w-full mb-3"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
          />
          <input
              className="border p-2 w-full mb-3"
              placeholder="License No"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
          />

          {/* User Credentials */}
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

          <button type="submit" className="bg-green-500 text-white w-full p-2 rounded">
            Sign Up
          </button>

          <p className="mt-2 text-center text-sm">
            Already have an account? <a href="/login" className="text-blue-600">Login</a>
          </p>
        </form>
      </div>
  );
}
