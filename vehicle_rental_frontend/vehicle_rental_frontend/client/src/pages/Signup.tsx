import { useState } from "react";
import axios from "axios";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, User, Phone, MapPin, FileText, Lock, Car } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    nicPassportNo: "",
    phoneNo: "",
    email: "",
    address: "",
    licenseNo: "",
    role: "CUSTOMER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!formData.fullName || !formData.email || !formData.username || !formData.password) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      await axios.post("http://localhost:8080/api/auth/signup", formData);

      alert("Signup successful! Please log in.");
      setLocation("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding and Info */}
          <div className="hidden lg:flex flex-col justify-center text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold">VehicleRent</h1>
              </div>
              <p className="text-blue-200 text-lg">Premium Vehicle Rental Management</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Wide Fleet Selection</h3>
                  <p className="text-blue-200 text-sm">Choose from our extensive collection of vehicles</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                  <p className="text-blue-200 text-sm">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-blue-200 text-sm">Our team is always ready to assist you</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-blue-200 mt-2">Join us and start your rental journey</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider">Personal Information</h3>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">NIC / Passport *</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          name="nicPassportNo"
                          value={formData.nicPassportNo}
                          onChange={handleInputChange}
                          placeholder="12345-6789012-1"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">License No *</label>
                      <div className="relative">
                        <Car className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          name="licenseNo"
                          value={formData.licenseNo}
                          onChange={handleInputChange}
                          placeholder="DL-2024-001"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                        <input
                          type="tel"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main St"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Credentials Section */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider">Account Credentials</h3>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Username *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="johndoe"
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-blue-400 hover:text-blue-300 transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 mt-6"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                {/* Login Link */}
                <p className="text-center text-blue-200 text-sm">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}