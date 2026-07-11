import { Link } from "react-router-dom";
import {
  BuildingOffice2Icon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========== NAVIGATION ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <BuildingOffice2Icon className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                PROPERTYMANAGER
              </span>
            </Link>

            {/* Navigation Links */}
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

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Smart <br />
                <span className="text-blue-600">Management</span>
              </h1>
              <p className="text-xl text-gray-600 mt-4">Property Management</p>
              <p className="text-gray-500 mt-2 max-w-lg">
                The all-in-one property management platform for landlords,
                property managers, and tenants. Streamline your operations with
                ease.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  to="/features"
                  className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm border border-gray-200"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">50+</p>
              <p className="text-sm text-gray-500 mt-1">Properties</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">20+</p>
              <p className="text-sm text-gray-500 mt-1">Active Clients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">15+</p>
              <p className="text-sm text-gray-500 mt-1">Contracts</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">10+</p>
              <p className="text-sm text-gray-500 mt-1">Transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose PROPERTYMANAGER?
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Everything you need to manage your properties efficiently in one
              powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Property Management
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Manage all your properties, track status, and monitor
                performance from a single dashboard.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Contract Management
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Create, sign, and track rental agreements with automated PDF
                generation and reminders.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analytics & Reports
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Get real-time insights with revenue reports, occupancy
                analytics, and financial summaries.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                User Management
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Role-based access for admins, property managers, tenants,
                landlords, and accountants.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Security & Compliance
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Enterprise-grade security with JWT authentication, audit logs,
                and role-based permissions.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                24/7 Support
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Dedicated support team available around the clock to help you
                with any issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
            Join thousands of property managers who trust PROPERTYMANAGER to
            streamline their operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition border border-blue-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BuildingOffice2Icon className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-bold text-white">
                  PROPERTYMANAGER
                </span>
              </div>
              <p className="text-sm">
                The all-in-one property management platform.
              </p>
              <p className="text-sm mt-2">
                © 2026 PROPERTYMANAGER. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/features" className="hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-white transition">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white transition">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/help" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-white transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/status" className="hover:text-white transition">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
