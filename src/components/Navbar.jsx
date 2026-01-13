import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { isAuth, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 text-sm font-medium transition ${
      pathname === path
        ? "text-emerald-600 border-b-2 border-emerald-600"
        : "text-gray-600 hover:text-emerald-600"
    }`;

const handleLogout = async () => {
  try {
    await api.post("/auth/logout"); // 👈 clear cookie on backend
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    dispatch(logout());
    navigate("/");
  }
};

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          Gig<span className="text-gray-800">Flow</span>
        </Link>

        {/* LINKS */}
        <div className="flex items-center gap-6">
          <Link to="/gigs" className={linkClass("/gigs")}>
            Gigs
          </Link>

          {isAuth && (
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              Dashboard
            </Link>
          )}

          {!isAuth ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* PROFILE */}
              <span className="text-sm font-medium text-gray-700">
                {user?.name || user?.email}
              </span>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
