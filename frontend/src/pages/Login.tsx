import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import coverImage from "../assets/cover.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <BuildingOffice2Icon className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                PROPERTYMANAGER
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                About
              </Link>
              <Link
                to="/service"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Service
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side – Cover Image */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex flex-col items-center justify-center text-white p-8">
            <BuildingOffice2Icon className="w-24 h-24 text-white/90" />
            <h1 className="text-4xl font-bold mt-4">PROPERTYMANAGER</h1>
            <p className="text-xl text-white/80 mt-2">
              Smart Property Management
            </p>
            <p className="text-sm text-white/60 mt-8 max-w-sm text-center">
              Manage your properties, contracts, and payments – all in one
              place.
            </p>
          </div>
        </div>

        {/* Right side – Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <BuildingOffice2Icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >
              {/* ===== DUMMY FIELDS TO CONFUSE BROWSER AUTOFILL ===== */}
              <div className="hidden">
                <input type="text" name="fakeEmail" value="" readOnly />
                <input type="password" name="fakePassword" value="" readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
