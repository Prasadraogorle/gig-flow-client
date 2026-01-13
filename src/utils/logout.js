import { logout } from "../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const handleLogout = (dispatch, navigate) => {
  // 1. Clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");

  // 2. Firebase sign out (safe even for normal login)
  signOut(auth).catch(() => {});

  // 3. Redux reset
  dispatch(logout());

  // 4. Redirect to landing
  navigate("/");
};
