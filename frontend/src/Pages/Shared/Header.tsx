import CustomLink from "./CustomLink";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  let location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <nav className="flex justify-around items-center bg-indigo-600 p-4 text-white shadow-lg">
      <CustomLink to="/">Home</CustomLink>
      {location.pathname !== "/login" && location.pathname !== "/register" ? (
        <button
          onClick={handleLogout}
          className="text-lg font-semibold px-4 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-700 hover:text-white transition"
        >
          Logout
        </button>
      ) : (
        <>
          <CustomLink to="/register">Register</CustomLink>
          <CustomLink to="/login">Login</CustomLink>
        </>
      )}
    </nav>
  );
}