import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Home from "./pages/landingpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import GigDetails from "./pages/GigDetails";
import Dashboard from "./pages/Dashboard";
import CreateGig from "./pages/CreateGig";

import socket from "./socket";

export default function App() {
  const { isAuth, user } = useSelector((state) => state.auth);

  /* ================= SOCKET LIFECYCLE ================= */
  useEffect(() => {
    if (isAuth && user?._id) {
      socket.connect();
      socket.emit("join", user._id);
      console.log("🟢 Socket connected");
    }

    return () => {
      socket.off("hired");
    };
  }, [isAuth, user]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= LANDING ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= PUBLIC (BLOCKED AFTER LOGIN) ================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ================= PUBLIC PAGES ================= */}
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/gigs/:id" element={<GigDetails />} />

        {/* ================= PROTECTED ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-gig"
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
