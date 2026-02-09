/** @format */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const localToken = localStorage.getItem("token");

  const token = reduxToken || localToken;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
