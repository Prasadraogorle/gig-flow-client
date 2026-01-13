import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-3xl text-center px-6 animate-fadeIn">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Hire Faster with{" "}
          <span className="text-emerald-600">GigFlow</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg mb-8">
          A real-time freelancing platform where clients post gigs,
          freelancers bid instantly, and work gets done efficiently.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Feature strip */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            ⚡ Real-time Bidding
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            💼 Client & Freelancer Roles
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            🔔 Live Hire Notifications
          </div>
        </div>
      </div>
    </div>
  );
}
