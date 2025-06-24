import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold text-blue-700">Mutual Fund App</h1>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-600">Search</Link>
            <Link to="/saved" className="text-gray-700 hover:text-blue-600">Saved</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
