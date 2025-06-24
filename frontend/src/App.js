import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthProvider";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import FundDetailsPage from "./pages/FundDetailsPage";
import SavedFundsPage from "./pages/SavedFundsPage";
import Navbar from "./components/Navbar";

function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<SearchPage />} />
          <Route path="/fund/:code" element={<FundDetailsPage />} />
          <Route path="/saved" element={<SavedFundsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
