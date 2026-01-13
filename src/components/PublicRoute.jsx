import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const isAuth = useSelector((state) => state.auth.isAuth);

  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}